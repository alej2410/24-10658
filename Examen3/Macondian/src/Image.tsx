///
/// Image.tsx
///

interface Props {
  image: string;
  alt?: string;
}


const Image = ({
  image,
  alt,
}: Props) => {

  /*
   * Las imágenes están en:
   *
   * Macondian/images/
   *
   * Image.tsx está en:
   *
   * Macondian/src/
   */
  const src =
    new URL(
      `../images/${image}`,
      import.meta.url
    ).href;


  return (

    <div className="image-panel">

      <img
        className="macondian-image"
        src={src}
        alt={
          alt ??
          `Macondian research visualization: ${image}`
        }
        draggable={false}
      />

    </div>
  );
};


export default Image;