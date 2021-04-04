//import './App.css';
import { SWRConfig } from 'swr';
import { DateTime, Duration } from 'luxon';
import preval from 'preval.macro'
import { NarouUpdates } from './NarouUpdates';

const IgnoreDuration = Duration.fromObject({ days: 30 });
const PollingInterval = 5 * 60 * 1000; // 5分ごとにポーリング

const buildDate: string = preval`module.exports = new Date().toISOString();`

function App() {
  return (
    <div className="App">
      <SWRConfig value={{
        refreshInterval: PollingInterval,
        fetcher: (args) => fetch(args).then(res => res.json())
      }}>
        <NarouUpdates ignoreDuration={IgnoreDuration} />
      </SWRConfig>
      <div style={{
        display: "inline-block",
        position: "fixed",
        bottom: 0,
        right: 0,
        fontSize: "small",
        fontStyle: "italic"
      }}>narou-react: {DateTime.fromISO(buildDate).toISO()}</div>
    </div>
  );
}

export default App;
