/**
 * Multi-Source Daily AI News & Research Service
 *
 * Integrates 3 Free Public APIs with automatic failover fallback:
 *  1. Hugging Face Daily Papers API (Morning Edition - 09:00)
 *  2. HackerNews Algolia AI API (Afternoon Edition - 14:00)
 *  3. arXiv AI Research API (Evening Edition - 19:00)
 *
 * If any primary source returns an error, times out, or is offline, it automatically
 * fails over to the 2nd source, then 3rd source, and finally to the offline curated feed.
 */

export interface AINewsItem {
  id: string;
  title: string;
  summary: string;
  source: string; // 'HuggingFace' | 'HackerNews' | 'arXiv' | 'Curated Offline'
  url: string;
  tag: string;
  timestamp: string;
  edition: 'morning' | 'afternoon' | 'evening';
  isFailover?: boolean;
  score?: number;
}

const CURATED_OFFLINE_EDITIONS: Record<'morning' | 'afternoon' | 'evening', AINewsItem> = {
  morning: {
    id: 'off-m1',
    title: 'DeepSeek-V3 & INT8 Quantization Latency Breakthrough',
    summary: 'Recent MoE architectures demonstrate near-lossless INT8/FP8 quantization, reducing memory overhead by 50% while maintaining reasoning benchmarks.',
    source: 'Hugging Face Daily',
    url: 'https://huggingface.co/papers',
    tag: 'Model Architecture',
    timestamp: '09:00 AM',
    edition: 'morning',
    score: 485,
  },
  afternoon: {
    id: 'off-a1',
    title: 'Small Language Models Achieve Sub-10ms Token Latency on NPUs',
    summary: 'Quantized 1B–3B parameter models running locally on mobile silicon achieve sub-10ms token generation for offline AI agents.',
    source: 'HackerNews AI',
    url: 'https://news.ycombinator.com',
    tag: 'Edge AI & Hardware',
    timestamp: '02:00 PM',
    edition: 'afternoon',
    score: 620,
  },
  evening: {
    id: 'off-e1',
    title: 'Self-Rewarding LLMs & Direct Preference Optimization',
    summary: 'New DPO variants enable models to self-curate preference alignment data during training, eliminating expensive RLHF human loops.',
    source: 'arXiv AI Research',
    url: 'https://arxiv.org/abs/2401.10020',
    tag: 'RLHF & Alignment',
    timestamp: '07:00 PM',
    edition: 'evening',
    score: 340,
  },
};

/** Parse XML title/summary from arXiv RSS feed without heavy XML parsers. */
const parseArxivXml = (xmlText: string): AINewsItem[] => {
  const items: AINewsItem[] = [];
  try {
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    let idx = 0;
    while ((match = entryRegex.exec(xmlText)) !== null && idx < 5) {
      const entryStr = match[1];
      const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(entryStr);
      const summaryMatch = /<summary>([\s\S]*?)<\/summary>/.exec(entryStr);
      const idMatch = /<id>([\s\S]*?)<\/id>/.exec(entryStr);

      if (titleMatch && summaryMatch) {
        const rawTitle = titleMatch[1].replace(/\n/g, ' ').trim();
        const rawSummary = summaryMatch[1].replace(/\n/g, ' ').trim();
        const rawUrl = idMatch ? idMatch[1].trim() : 'https://arxiv.org/list/cs.AI/recent';

        items.push({
          id: `arxiv-${idx}`,
          title: rawTitle.replace(/^arXiv:\S+\s*/i, ''),
          summary: rawSummary.slice(0, 180) + '...',
          source: 'arXiv AI',
          url: rawUrl,
          tag: 'Research Paper',
          timestamp: '07:00 PM',
          edition: 'evening',
          score: 150 + idx * 20,
        });
        idx++;
      }
    }
  } catch {}
  return items;
};

// 1. Fetch Hugging Face Daily Papers
export const fetchHuggingFaceNews = async (): Promise<AINewsItem | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://huggingface.co/api/daily_papers', {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const p = data[0].paper;
        return {
          id: p?.id ?? 'hf-0',
          title: p?.title ?? 'Latest Hugging Face AI Paper',
          summary: (p?.summary ?? 'Explore daily peer-reviewed AI research paper.').slice(0, 180) + '...',
          source: 'Hugging Face Daily',
          url: `https://huggingface.co/papers/${p?.id}`,
          tag: 'Daily Paper',
          timestamp: '09:00 AM',
          edition: 'morning',
          score: data[0].upvotes ?? 250,
        };
      }
    }
  } catch {}
  return null;
};

// 2. Fetch HackerNews Algolia AI News
export const fetchHackerNewsAINews = async (): Promise<AINewsItem | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://hn.algolia.com/api/v1/search?query=AI+machine+learning&tags=story&hitsPerPage=5', {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data.hits && data.hits.length > 0) {
        const h = data.hits[0];
        return {
          id: `hn-${h.objectID}`,
          title: h.title ?? 'Trending AI Discussion on HackerNews',
          summary: `Discussion on HackerNews regarding ${h.title}. Score: ${h.points ?? 100} points with ${h.num_comments ?? 50} comments.`,
          source: 'HackerNews AI',
          url: h.url ?? `https://news.ycombinator.com/item?id=${h.objectID}`,
          tag: 'Trending Story',
          timestamp: '02:00 PM',
          edition: 'afternoon',
          score: h.points ?? 180,
        };
      }
    }
  } catch {}
  return null;
};

// 3. Fetch arXiv AI Feed
export const fetchArxivNews = async (): Promise<AINewsItem | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=submittedDate&max_results=5', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const xmlText = await res.text();
      const items = parseArxivXml(xmlText);
      if (items.length > 0) return items[0];
    }
  } catch {}
  return null;
};

/** Get news for specific edition with automatic failover chain across all 3 sources. */
export const getEditionNews = async (edition: 'morning' | 'afternoon' | 'evening'): Promise<AINewsItem> => {
  let primary: AINewsItem | null = null;

  if (edition === 'morning') {
    primary = await fetchHuggingFaceNews();
    if (!primary) primary = await fetchHackerNewsAINews();
    if (!primary) primary = await fetchArxivNews();
  } else if (edition === 'afternoon') {
    primary = await fetchHackerNewsAINews();
    if (!primary) primary = await fetchHuggingFaceNews();
    if (!primary) primary = await fetchArxivNews();
  } else {
    primary = await fetchArxivNews();
    if (!primary) primary = await fetchHuggingFaceNews();
    if (!primary) primary = await fetchHackerNewsAINews();
  }

  if (primary) return primary;

  // Final fallback to offline curated feed
  return { ...CURATED_OFFLINE_EDITIONS[edition], isFailover: true };
};

/** Get all 3 editions (Morning, Afternoon, Evening) with failover protection. */
export const getAllDailyNewsEditions = async (): Promise<Record<'morning' | 'afternoon' | 'evening', AINewsItem>> => {
  const [morning, afternoon, evening] = await Promise.all([
    getEditionNews('morning'),
    getEditionNews('afternoon'),
    getEditionNews('evening'),
  ]);
  return { morning, afternoon, evening };
};

export const getCuratedNewsSync = (): Record<'latest' | 'missed' | 'papers', AINewsItem> => ({
  latest: { ...CURATED_OFFLINE_EDITIONS.morning, tag: 'Latest Breakthrough' },
  missed: { ...CURATED_OFFLINE_EDITIONS.afternoon, tag: 'Missed Update' },
  papers: { ...CURATED_OFFLINE_EDITIONS.evening, tag: 'Research Paper' },
});

