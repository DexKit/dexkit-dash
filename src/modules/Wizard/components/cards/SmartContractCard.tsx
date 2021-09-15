import React, {useCallback} from 'react';
import {Box, Typography, Card, CardContent, Button} from '@material-ui/core';

export interface SmartContractCardProps {
  title: string;
  description: string;
  slug: string;
  onClick: (slug: string) => void;
}

export const SmartContractCard = (props: SmartContractCardProps) => {
  const {title, description, onClick, slug} = props;

  const handleClick = useCallback(
    (e) => {
      onClick(slug);
    },
    [onClick, slug],
  );

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant='subtitle1'>
          {title}
        </Typography>
        <Typography variant='body2'>{description}</Typography>
        <Box pt={4}>
          <Button onClick={handleClick} color='primary' variant='contained'>
            Deploy
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SmartContractCard;
