///
/// CLI.tsx
///

import { SubmitEvent } from 'react';

interface Props {
  req: (event: SubmitEvent<HTMLFormElement>) => void;
  ref: React.RefObject<HTMLInputElement | null>;
};

const CLI = (props: Props) => {
  return (
  <form className="cli-form" onSubmit={props.req}>
    <input className="cli-command" style={{ color: "black", backgroundColor: "#C0E090" }} ref={props.ref} />
    <input style = {{ color: "lightgreen", backgroundColor: "#060606" }} type = "submit" value = ">>>" />
  </form>
  );
};

export default CLI;
