import { splitAlpha } from '../Gradient';

// react-native-svg drops the alpha of a Stop's stopColor; splitAlpha must pull
// it out so fades don't collapse into solid bands (the "2 shades" canvas bug).
test('splitAlpha extracts alpha from rgba/hex8 and leaves opaque colors alone', () => {
  expect(splitAlpha('rgba(124,92,255,0.18)')).toEqual({ color: 'rgb(124, 92, 255)', alpha: 0.18 });
  expect(splitAlpha('rgba(124,92,255,0)')).toEqual({ color: 'rgb(124, 92, 255)', alpha: 0 });
  expect(splitAlpha('#7C5CFF80')).toEqual({ color: '#7C5CFF', alpha: 128 / 255 });
  expect(splitAlpha('#0E0A24')).toEqual({ color: '#0E0A24', alpha: 1 });
  expect(splitAlpha('rgb(20, 20, 20)')).toEqual({ color: 'rgb(20, 20, 20)', alpha: 1 });
});
