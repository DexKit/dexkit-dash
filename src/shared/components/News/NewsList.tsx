import React from 'react';
import {Box, makeStyles, List, ListItem, ListItemText} from '@material-ui/core';
import {Fonts} from 'shared/constants/AppEnums';
import Scrollbar from '@crema/core/Scrollbar';
import {CremaTheme} from 'types/AppContextPropsType';
import {FeedItem} from 'types/rss/feedItem.interface';

interface LatestNewsProps {
  data: FeedItem[] | undefined;
}

const NewsList: React.FC<LatestNewsProps> = ({data}) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    newsImg: {
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '10rem',
      },
    },
    newsContent: {
      flex: '1 1 0',
    },
    listItem: {
      paddingTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
      display: 'flex',
      alignItems: 'flex-start',
      flexDirection: 'column',
      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
      },

      '&:last-child': {
        paddingBottom: 0,
      },
    },
  }));

  const classes = useStyles();

  return (
    <Scrollbar>
      <List>
        {data &&
          data.map((news) => {
            return (
              <ListItem key={news.guid} className={classes.listItem}>
                <ListItemText
                  className={classes.newsContent}
                  primary={
                    <Box
                      mb={1}
                      component='span'
                      display='flex'
                      alignItems='center'
                      fontSize={{xs: 16, xl: 18}}>
                      <Box color='grey.500'>{news.pubDate}</Box>
                      <Box ml={2} color='primary.main'>
                        {news.creator}
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box
                      component='span'
                      color='grey.700'
                      fontFamily={Fonts.MEDIUM}
                      fontSize={{xs: 14, sm: 16, xl: 18}}>
                      {news.contentSnippet || news.content}
                    </Box>
                  }
                />
                <Box ml={{sm: 3, xl: 5}}>
                  <img className={classes.newsImg} src={news.enclosure?.url} />
                </Box>
              </ListItem>
            );
          })}
      </List>
    </Scrollbar>
  );
};

export default NewsList;
