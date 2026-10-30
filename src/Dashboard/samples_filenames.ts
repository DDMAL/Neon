import type { NotationType } from '../utils/NotationTypeCache';

/**
 * The built-in samples: name, type, and for folios the notation type their
 * MEI declares in staffDef@notationtype.
 *
 * Sample MEI ships with the code rather than living in the browser, so its
 * notation type is listed here instead of in the dashboard's notation type
 * list - a change to a sample then reaches everyone on the next deploy.
 * The MEI is still the source: test/SampleNotationType.test.ts fails if a
 * listed notation type no longer matches the sample's MEI.
 */
export const samples: [string, 'folio' | 'manuscript', NotationType?][] = [
  ['CDN-Hsmu_M2149.L4_001r', 'folio', 'square'],
  ['CDN-Hsmu_M2149.L4_002r', 'folio', 'square'],
  ['CH-E_611_024r', 'folio', 'square'],
  ['CH-E_611_026r', 'folio', 'square'],
  ['CH-E_611_028r', 'folio', 'square'],
  ['St_Gall_022r_one_staff', 'folio', 'hufnagel'],
  ['Salzinnes', 'manuscript'],
];

/**
 * @returns The notation type of a sample folio, or undefined for anything
 * that is not one.
 */
export function getSampleNotationType(name: string): NotationType | undefined {
  return samples.find(([sampleName]) => sampleName === name)?.[2];
}
