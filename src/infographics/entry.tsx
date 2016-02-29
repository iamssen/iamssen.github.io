import * as React from 'react';

import BasicCharts from './components/basic-charts';

const Infographics = () => (<div>
  <BasicCharts/>
</div>);

export default function () {
  return {path: '/infographics', title: 'Infographics', component: Infographics};
}