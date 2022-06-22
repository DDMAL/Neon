import PouchDb from 'pouchdb-core';

/** Modeled after the [W3 Web Annotation Data Model.](https://www.w3.org/TR/annotation-model/) */
export type WebAnnotation = {
  id: string,
  type: string,
  body: string,
  target: string
};

/** Required @context field in the JSON-LD Neon manifest;
 * see https://github.com/DDMAL/Neon/blob/gh-pages/contexts/1/manifest.JSON-LD
 */
export type NeonContext = {
  schema: string,
  title: string,
  timestamp: string,
  image: {
    '@id': string,
    '@type': string,
  },
  mei_annotations: {
    '@id': string,
    '@type': string,
    '@container': string
  }
};

/** Required fields in the JSON-LD Neon manifest. */
export type NeonManifest = {
  '@context': Array<string | NeonContext> | string,
  '@id': string,
  title: string,
  timestamp: string,
  image: string,
  mei_annotations: WebAnnotation[]
};

export type allDocs = {
  offset?: number,
  total_rows?: number,
  rows?: { 
    doc?: PouchDB.Core.ExistingDocument<PouchDB.Core.AllDocsMeta> & { kind?: string }; 
    id: string; 
    key: string; 
    value: { 
      rev: string; 
      deleted?: boolean; 
    }; 
  }[]
};


