import React, { useContext, useEffect, useState } from 'react';
import { Divider, Tabs } from 'antd';
import './Details.scss';
import Fingerprint from './Fingerprint/Fingerprint';
import Explain from './Explain/Explain';
import Example from './Example/Example';
import Metrics from './Metrics/Metrics';
import { PanelProvider } from '../../../../panel/panel.provider';
import TableCreateContainer from './Table/TableContainer';
import { useDetailsState } from './Details.hooks';
import { DATABASE, TabKeys } from './Details.constants';
import { DetailsContentProvider, DetailsProvider } from './Details.provider';

const { TabPane } = Tabs;

const Details = () => {
  const {
    contextActions: { closeDetails },
    panelState: { queryId, groupBy, fingerprint, controlSum, totals },
  } = useContext(PanelProvider);
  const {
    detailsState: { databaseType, classicExplain, jsonExplain, examples, tables },
  } = useContext(DetailsProvider);

  useDetailsState();
  const [activeTab, setActiveTab] = useState(TabKeys.Details);
  const showTablesTab = databaseType !== DATABASE.mongodb;
  const showExplainTab = databaseType !== DATABASE.postgresql;
  useEffect(() => setActiveTab(TabKeys.Details), [queryId]);

  return (
    <div className="query-analytics-details-grid" id="query-analytics-details">
      <Fingerprint
        totals={totals}
        query={fingerprint}
        controlSum={controlSum}
        groupBy={groupBy}
        closeDetails={closeDetails}
      />
      <div className="details-tabs">
        <Divider style={{ margin: 0 }} />
        <Tabs activeKey={activeTab} onChange={setActiveTab} tabPosition="top" destroyInactiveTabPane>
          <TabPane tab={<span>Details</span>} key={TabKeys.Details}>
            <Metrics databaseType={databaseType} />
          </TabPane>
          {groupBy === 'queryid' && !totals ? (
            <TabPane tab={<span>Examples</span>} key={TabKeys.Examples} disabled={queryId === 'TOTAL'}>
              <Example fingerprint={fingerprint} databaseType={databaseType} examples={examples} />
            </TabPane>
          ) : null}
          {groupBy === 'queryid' && showExplainTab && !totals ? (
            <TabPane tab={<span>Explain</span>} key={TabKeys.Explain} disabled={queryId === 'TOTAL'}>
              <Explain classicExplain={classicExplain} jsonExplain={jsonExplain} />
            </TabPane>
          ) : null}
          {groupBy === 'queryid' && showTablesTab && !totals ? (
            <TabPane tab={<span>Tables</span>} key={TabKeys.Tables} disabled={queryId === 'TOTAL'}>
              <TableCreateContainer databaseType={databaseType} examples={examples} tables={tables} />
            </TabPane>
          ) : null}
        </Tabs>
      </div>
    </div>
  );
};

export default () => {
  return (
    <DetailsContentProvider>
      <Details />
    </DetailsContentProvider>
  );
};
