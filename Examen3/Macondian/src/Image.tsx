///
/// Image
///

interface Props {
  image: string; 
};

const Image = ({ image }: Props) => {
  const src = new URL(`../images/${image}`, import.meta.url).href;
  return (
    <div style={{ display: "inline-block", verticalAlign: "top" }}>
      <div className="splash-image transparent" style={{ float: "left" }}>
        <img
          src={src}
        />
      </div>
    </div>
  );
};

export default Image;
