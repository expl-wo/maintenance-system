/**
 * Created by fp on 2020/9/1.
 */
import normal from "./normal";
let cache = {};
export const getThemeByName = function (echarts, themeName) {
  if (!cache[themeName]) {
    switch (themeName) {
      case 'normal':
        cache[themeName] = normal;
        break;
      default:
        cache[themeName] = normal;
        break;
    }
    echarts.registerTheme(themeName, cache[themeName]);
  }
  return themeName;
};

export const getThemeDefault = function (echarts) {
  return getThemeByName(echarts, 'normal');
};
