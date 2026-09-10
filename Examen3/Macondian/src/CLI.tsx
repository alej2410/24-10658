///
/// CLI.tsx
///

import type {
  FormEvent,
  RefObject,
} from "react";


interface Props {
  req: (
    event: FormEvent<HTMLFormElement>
  ) => void;

  ref: RefObject<HTMLInputElement | null>;
}


const CLI = ({
  req,
  ref,
}: Props) => {

  return (

    <form
      className="cli-form"
      onSubmit={req}
    >

      <input
        className="cli-command"
        ref={ref}
        aria-label="Macondian command"
        autoComplete="off"
        spellCheck={false}
      />

      <input
        type="submit"
        value=">>>"
        aria-label="Execute command"
      />

    </form>
  );
};


export default CLI;