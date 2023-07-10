import { loadDashboard } from '../../src/Dashboard/Dashboard';

loadDashboard();
document.querySelector('#home-link')?.setAttribute('href', __LINK_LOCATION__);