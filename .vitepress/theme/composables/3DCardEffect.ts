export function use3DCardEffect(elem?: HTMLElement, range = 1) {
  if (!elem) return;
  let xRange = [-range, range];
  let yRange = [-range, range];
  const getRotateValue = (range: number[], offset: number, total: number) => {
    const [min, max] = range;
    return (offset / total) * (max - min) + min;
  };

  const handleMouseMove = (e: MouseEvent) => {
    const { offsetX, offsetY } = e;
    const { offsetWidth, offsetHeight } = elem;
    const x = getRotateValue(xRange, offsetX, offsetWidth);
    const y = -getRotateValue(yRange, offsetY, offsetHeight);

    elem.style.setProperty('--rotateX', `${x}deg`);
    elem.style.setProperty('--rotateY', `${y}deg`);
  };

  const handleMouseLeave = () => {
    elem.style.setProperty('--rotateX', '0deg');
    elem.style.setProperty('--rotateY', '0deg');
  };

  // 使用 addEventListener
  elem.addEventListener('mousemove', handleMouseMove);
  elem.addEventListener('mouseleave', handleMouseLeave);

  // 返回清理函数
  return () => {
    elem.removeEventListener('mousemove', handleMouseMove);
    elem.removeEventListener('mouseleave', handleMouseLeave);
  };
}
