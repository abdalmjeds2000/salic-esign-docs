import React from 'react';
import { Group, Image, Transformer } from 'react-konva';
import useImage from 'use-image';

const URLImage = ({ _id, src, shapeProps, isSelected, onSelect, onChange, onClick, onTap }) => {
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
          draggable
          onClick={(e) => {
            if(onSelect) onSelect();
            if(onClick) onClick(e);
          }}
          onTap={(e) => {
            if(onSelect) onSelect();
            if(onTap) onTap(e);
          }}
          ref={shapeRef}
          // onMouseOver={() => document.body.style.cursor = "pointer"}
          // onMouseLeave={() => document.body.style.cursor = "initial"}
          perfectDrawEnabled={false}
          {...shapeProps}
          onTransformEnd={(e) => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
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
    </React.Fragment>
  );
};

export default URLImage