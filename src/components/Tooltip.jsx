import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import React from 'react';

const Tooltip = ({ hoveredObject, pointerX, pointerY }) => {
  return (
    hoveredObject && (
      <div
        style={{
          position: 'absolute',
          zIndex: 1,
          left: pointerX,
          top: pointerY,
        }}
      >
        <Card variant="outlined">
          <CardContent>
            {hoveredObject.points.map((offre, index) => {
              return (
                <>
                  <Typography variant="body2" component="p">
                    <Link
                      href={offre.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <li>{offre.intitule} </li>
                    </Link>
                  </Typography>
                </>
              );
            })}
          </CardContent>
        </Card>
      </div>
    )
  );
};

export default Tooltip;
