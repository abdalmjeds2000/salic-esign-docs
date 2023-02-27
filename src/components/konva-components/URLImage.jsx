import React from 'react';
import { Group, Image, Transformer } from 'react-konva';
import useImage from 'use-image';

const URLImage = ({ _id, src, shapeProps, isSelected, onSelect, onChange }) => {
  const [img] = useImage(src);
  const shapeRef = React.useRef();
  const trRef = React.useRef();


  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);



  // const shapeX = shapeRef?.current?.attrs?.x + (shapeRef?.current?.attrs?.width * shapeRef?.current?.attrs?.scaleX) || 0 || 0;
  // const shapeY = shapeRef?.current?.attrs?.y || 0;
  return (
    <React.Fragment>
      <Group>
        <Image
          _id={_id}
          image={img}
          // I will use offset to set origin to the center of the image
          dash={12}
          draggable
          onClick={onSelect}
          onTap={onSelect}
          ref={shapeRef}
          onMouseOver={() => document.body.style.cursor = "pointer"}
          onMouseLeave={() => document.body.style.cursor = "initial"}
          
          {...shapeProps}
          onTransformEnd={(e) => {
            // transformer is changing scale of the node
            // and NOT its width or height
            // but in the store we have only width and height
            // to match the data better we will reset scale on transform end
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            // we will reset it back
            // node.scaleX(1);
            // node.scaleY(1);

            onChange({
              ...node.attrs,
              x: node.x(),
              y: node.y(),
              width: node.width(),
              height: node.height(),
              scaleX: scaleX,
              scaleY: scaleY,
            });
          }}
        />
      {/* {isSelected && <Rect 
        x={(shapeX) + 5}
        y={shapeY}
        width={10}
        height={10}
        scaleX={1}
        scaleY={1}
        onClick={() => setIsisOpenSignCM(prev => !prev)}
        onMouseOver={() => document.body.style.cursor = "pointer"}
        onMouseLeave={() => document.body.style.cursor = "initial"}
        fill="red"
      />} */}
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          keepRatio={false}
          rotateAnchorOffset={25}
          anchorSize={10}
          anchorCornerRadius={2}
          borderStroke="#4466ff"
          anchorStroke='#4466ff'
          anchorStrokeWidth={2}
          borderStrokeWidth={2}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 25 || newBox.height < 25) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
        {/* <ContextMenu /> */}

    </React.Fragment>
  );
};

export default URLImage