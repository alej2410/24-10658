///
/// Macondian.tsx
///

import { SubmitEvent, useEffect, useRef, useState } from 'react';

import Chart from "./Chart";
import CLI from "./CLI";
import Image from "./Image";
import List from "./List";
import Monitor from "./Monitor";
import ToolBar from "./ToolBar";

import 'bootstrap/dist/css/bootstrap.min.css';

const project = "ZenSheet™";
const artefact = "Macondian Simulator";
const version = "V-20260901";

const title = <h3>The Great {artefact}</h3>;
const product = <em><b>{artefact}</b> Interactive Computing Environment</em>;
const copyright = <>Copyright © <b>Lakebolt™ Research</b> 2024-2026</>


// max log entries retained in the Monitor
const MONITOR_SIZE = 1024;

// TGMR
const tgmr = new Worker(new URL("./Macondian/tgmr-thx-1138.js", import.meta.url))

const Macondian = () => {

  // Command-line input ref, for reading the current value on submit
  const command = useRef<HTMLInputElement>(null);

  // History of code and responses, shown in the Monitor pane.
  const [rawLog, setRawLog] = useState<string[]>([]);

  // *** Recomiendo que se inspiren en la visualización de la "señal cruda" para hacer la del resultado ***
  // presten atención a la entrevista para deducir el tipo del resultado
  // const [seriesLog, seriesLog] = useState<aqui definen el tipo de la serie>(aqui definen el valor inicial);

  // View mode (user experience)
  const [ux, setUX] = useState(0);

  // View mode color
  const uxColor = (mode: number) => {
    return mode === ux ? "Yellow" : "Gray";
  }

  // Manejo de errores
  const [error, setError] = useState<string>('');

  // Resizable split between the Editor (left) and Monitor (right) panes.
  // `leftPct` is the Editor's flex-grow share of the split row; the Monitor
  // pane takes the complementary share. The ratio is measured against the
  // split container itself, so a FilePicker to its left does not skew it.
  const [leftPct, setLeftPct] = useState(50);
  const splitRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      if (!dragging.current || !splitRef.current) return;
      const rect = splitRef.current.getBoundingClientRect();
      const pct = ((event.clientX - rect.left) / rect.width) * 100;
      setLeftPct(Math.min(80, Math.max(20, pct)));   // keep both panes usable
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const startDrag = (event: React.MouseEvent) => {
    event.preventDefault();
    dragging.current = true;
    document.body.style.userSelect = 'none';   // no text selection while dragging
    document.body.style.cursor = 'col-resize';
  };

  const addHistoryItem = (item: string) => {
    setRawLog(h => {
      const next = h.length < MONITOR_SIZE ? [...h, item] : [...h.slice(1), item];
      return next;
    });
  };

  // Wire the worker callback once, then prime the VM.
  // The callback uses functional setHistory, so ...
  // ... it stays correct without re-binding on every render.
  useEffect(() => {
    tgmr.onmessage = (envelope: MessageEvent) => {
      const data = envelope.data;
      if (!data) {
        addHistoryItem(`ERROR: bad data in ${envelope}`);
        return;
      }
      addHistoryItem(data);
    };
  }, []);

  const send = (request: string) => {
    tgmr.postMessage(`${request}`);
  }

  const clearRawLog = () => setRawLog([]);

  //
  // Toobar functions
  //

  const start = () => {
    send(".start");
  }

  const reset = () => {
    send(".reset");
    setTimeout(clearRawLog, 496);
  }

  const nop = () => {
  }

  const kvp = [
    { key: ".start", fun: start },
    { key: ".reset", fun: reset },
  ];

  const map = (key: string) => {
    for (let element of kvp) {
      if (key === element.key) {
        return element.fun;
      }
    }
    return nop;
  };

  // CLI request
  const cliRequest = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (command.current) {
      const request = command.current.value;
      command.current.value = "";
      map(request)();
    }
  }

  //
  // Views
  //

  const rawView = (
    <div className="app-split" ref={splitRef}>
      <section className="app-pane" data-bs-theme="dark" style={{ flexGrow: leftPct }}>
        <Monitor title={"señal cruda"} log={rawLog} />
      </section>
      <div className="pane-divider" onMouseDown={startDrag} title="Drag to resize" />
      <section className="app-pane" style={{ flexGrow: 100 - leftPct }}>
        <Image image={"MAC997.jpg"}/>
      </section>
    </div>
  );

  const testView = (
    <div className="app-split" ref={splitRef}>
      <section className="app-pane" data-bs-theme="dark" style={{ flexGrow: leftPct }}>
        <Monitor title={"señal cruda"} log={rawLog} />
      </section>
      <div className="pane-divider" onMouseDown={startDrag} title="Drag to resize" />
      <section className="app-pane" style={{ flexGrow: 100 - leftPct }}>
        <Monitor title={"serie"} log={[]} />
      </section>
    </div>
  );

  const chartView = (
    <div className="app-split" ref={splitRef}>
      <section className="app-pane" data-bs-theme="dark" style={{ flexGrow: leftPct }}>
        <Monitor title={"señal cruda"} log={rawLog} />
      </section>
      <div className="pane-divider" onMouseDown={startDrag} title="Drag to resize" />
      <section className="app-pane" style={{ flexGrow: 100 - leftPct }}>
        <Chart data={[]} />
      </section>
    </div>
  );

  const imageView = (
    <Image image={Math.random() < 0.5 ? "ART042.jpg" : "ART067.png"}/>
  );

  const listView = (
    <List/>
  );

  const views = [ rawView, testView, chartView, imageView, listView ];

  return (
    <div className="app-shell">
      <header className="app-header">
        <>{title}</>
      </header>
      <ToolBar
        start={start}
        reset={reset}
        uxColor={uxColor}
        setUX={setUX}
        error={error}
      />
      <main className="app-main">
        { views[ux] }
      </main>
      <CLI req={cliRequest} ref={command} />
      <footer className="app-footer">
        <h6><b>{project}</b> Project: {product} {version} - {copyright} </h6>
      </footer>
    </div>
  );
}

export default Macondian;
