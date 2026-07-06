// Lottie JSON 내 모든 fill/stroke 색상을 지정한 hex 색상 하나로 통일 — 테스트별 브랜드 컬러 적용용.
// layerOpacities를 넘기면 최상위 레이어별로 다른 투명도를 줘서 톤온톤 그라데이션을 만들 수 있다
// (배열 인덱스는 data.layers 순서와 대응, 값은 0~1).
function hexToRgba1(hex: string): [number, number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return [r, g, b, 1];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyColorAndOpacity(node: any, rgba: [number, number, number, number], opacityPercent?: number) {
  if (Array.isArray(node)) {
    node.forEach(n => applyColorAndOpacity(n, rgba, opacityPercent));
    return;
  }
  if (node && typeof node === 'object') {
    if ((node.ty === 'fl' || node.ty === 'st') && node.c?.k) {
      node.c.k = rgba;
      if (opacityPercent !== undefined && node.o && typeof node.o.k !== 'undefined') {
        node.o.k = opacityPercent;
      }
    }
    Object.values(node).forEach(v => applyColorAndOpacity(v, rgba, opacityPercent));
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function recolorLottie(data: any, hex: string, layerOpacities?: number[]): any {
  const rgba = hexToRgba1(hex);
  const cloned = JSON.parse(JSON.stringify(data));

  if (layerOpacities && Array.isArray(cloned.layers)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cloned.layers.forEach((layer: any, i: number) => {
      const opacity = layerOpacities[i];
      applyColorAndOpacity(layer.shapes, rgba, opacity !== undefined ? opacity * 100 : undefined);
    });
  } else {
    applyColorAndOpacity(cloned.layers, rgba);
  }

  return cloned;
}
