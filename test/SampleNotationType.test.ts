import * as fs from 'fs';
import * as path from 'path';
import { samples } from '../src/Dashboard/samples_filenames';
import { getNotationType } from '../src/utils/ConvertMei';

// ConvertMei imports Notification, which pulls in editor UI modules that
// need build-time globals. None of it is used when reading a notation type.
jest.mock('../src/utils/Notification', () => ({}));

const serverRoot = path.join(__dirname, '../deployment/server');

// The dashboard labels samples from samples_filenames.ts, so that list has
// to follow the sample MEI. Read the MEI the same way the editor finds it:
// through the sample's manifest.
describe('sample notation types match their MEI', () => {
  const folios = samples.filter(([, type]) => type === 'folio');

  test.each(folios)('%s', (name, _type, notationType) => {
    const manifest = JSON.parse(
      fs.readFileSync(
        path.join(serverRoot, 'samples/manifests', `${name}.jsonld`),
        'utf8',
      ),
    );
    const mei = fs.readFileSync(
      path.join(serverRoot, manifest.mei_annotations[0].body),
      'utf8',
    );

    expect(notationType).toBe(getNotationType(mei));
  });
});
