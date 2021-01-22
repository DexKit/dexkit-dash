import React from 'react';
import Slider from 'react-slick';
import CourseItem from './CourseItem';
import {makeStyles, Paper} from '@material-ui/core';
import {RelatedCoursesData} from '../../../../types/models/Academy';
import {CremaTheme} from '../../../../types/AppContextPropsType';

const useStyles = makeStyles((theme: CremaTheme) => ({
  slideRoot: {
    paddingBottom: 0,
    [theme.breakpoints.up('sm')]: {
      marginLeft: -12,
      marginRight: -12,
    },
    '& .slick-slide': {
      '&  img': {
        height: 'auto',
        borderRadius: theme.overrides.MuiCard.root.borderRadius,
      },
    },
    '& .slick-prev, & .slick-next': {
      top: -25,
      '&:before': {
        color: theme.palette.text.primary,
      },
    },
    '& .slick-prev': {
      right: 32,
      left: 'auto',
    },
    '& .slick-next': {
      right: 10,
    },
  },
}));
interface RelatedCoursesProps {
  relatedCourses: RelatedCoursesData[];
}

const RelatedCourses: React.FC<RelatedCoursesProps> = ({relatedCourses}) => {
  const classes = useStyles();

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Paper style={{marginTop: 20, padding: 10}}>
      <Slider className={classes.slideRoot} {...settings}>
        {relatedCourses.map((data, index) => (
          <CourseItem key={index} data={data} />
        ))}
      </Slider>
    </Paper>
  );
};

export default RelatedCourses;
