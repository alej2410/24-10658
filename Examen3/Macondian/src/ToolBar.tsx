///
/// ToolBar
///

interface Props {
  start: () => void;
  reset: () => void;
  uxColor: (mode: number) => string;
  setUX: (mode: number) => void;
  error?: string; 
};

const ToolBar = (props: Props) => {
  return (
    <div className="app-toolbar mt-2" data-bs-theme="dark">
      <div className="input-group">
        { props.error && <span className="toolbar-error">{props.error}</span> }
        <button className="input-group-text" title={"Start the Macondian Reactor"} style={{ color: "lightgreen" }} onClick={props.start}>Start Macondian</button>
        <text className="input-group-text flex-fill"/>
        <button className="input-group-text" title={"Raw: ..."  } style={{ color: props.uxColor(0) }} onClick={props.setUX.bind(null, 0)}>Raw</button>
        <button className="input-group-text" title={"Test: ..." } style={{ color: props.uxColor(1) }} onClick={props.setUX.bind(null, 1)}>Test</button>
        <button className="input-group-text" title={"Chart: ..."} style={{ color: props.uxColor(2) }} onClick={props.setUX.bind(null, 2)}>Chart</button>
        <button className="input-group-text" title={"Image: ..."} style={{ color: props.uxColor(3) }} onClick={props.setUX.bind(null, 3)}>Image</button>
        <button className="input-group-text" title={"List: ..." } style={{ color: props.uxColor(4) }} onClick={props.setUX.bind(null, 4)}>List</button>
        <text className="input-group-text flex-fill"/>
        <button className="input-group-text" title={"Reset the Macondian Reactor"} style={{ color: "orange" }} onClick={props.reset}>Reset Macondian</button>
      </div>
    </div>
  )
};

export default ToolBar;
