import NeonView from "../../NeonView";

export async function setBody (): Promise<void> {
  const response = await fetch(__ASSET_PREFIX__ + 'assets/template.html');
  document.body.innerHTML = await response.text();
  (document.getElementById('home-link') as HTMLAnchorElement)
    .href = __LINK_LOCATION__;
  document.getElementById('neon-version').textContent = __NEON_VERSION__;
}

export function setNavbarDefaultListeners(neonView: NeonView): void {
    // Event listener for "Remove Empty Syllables" button
    document.getElementById('remove-empty-syls').addEventListener('click', function() {
      const uri = neonView.view.getCurrentPageURI();

      neonView.getPageMEI(uri).then(meiString => {
        const parser = new DOMParser();
        const meiDoc = parser.parseFromString(meiString, 'text/xml');
        const mei = meiDoc.documentElement;
        const syllables = Array.from(mei.getElementsByTagName('syllable'));

        // Check syllable without neume
        for (const syllable of syllables) {
          if (syllable.getElementsByTagName('neume').length === 0) {
            syllable.remove();
          }
        }
      });
    });

    // Event listener for "Remove Empty Neumes" button
    document.getElementById('remove-empty-neumes').addEventListener('click', function() {
      const uri = neonView.view.getCurrentPageURI();

      neonView.getPageMEI(uri).then(meiString => {
        const parser = new DOMParser();
        const meiDoc = parser.parseFromString(meiString, 'text/xml');
        const mei = meiDoc.documentElement;
        const neumes = Array.from(mei.getElementsByTagName('neume'));

        // Check neume without neume component
        for (const neume of neumes) {
          if (neume.getElementsByTagName('nc').length === 0) {
            neume.remove();
          }
        }
      });
    });
}