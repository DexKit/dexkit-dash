import { FilterGame, FilterPlayerGame, GameDuration } from '../constants/enums';

export const strPad = (str: number): string => {
  if (str > 100) {
    return (new Array(3).join('0') + str).slice(-3);
  }

  return (new Array(3).join('0') + str).slice(-2);
};

export const GET_LABEL_FROM_DURATION = (time: Number) => {
  switch (time) {
    case 60 * 5:
      return '5 min';
    case 60 * 60:
      return '1 hr';
    case 4 * 60 * 60:
      return '4 hrs';
    case 8 * 60 * 60:
      return '8 hrs';
    case 24 * 60 * 60:
      return '24 hrs';
    case 7 * 24 * 60 * 60:
      return '1 week';
    case 30 * 7 * 24 * 60 * 60:
      return '1 month';
    default:
      return '1 hr';
  }
};

export const GET_DURATION_FROM_FILTER = (filter: FilterGame) => {
  switch (filter) {
    case FilterGame.ALL:
      return null;
    case FilterGame.Fast:
      return 60 * 60;
    case FilterGame.Medium:
      return 4 * 60 * 60;
    case FilterGame.Eight:
      return 8 * 60 * 60;
    case FilterGame.Day:
      return 24 * 60 * 60;
    case FilterGame.Week:
      return 7 * 24 * 60 * 60;
    case FilterGame.Month:
      return 30 * 7 * 24 * 60 * 60;
    default:
      return null;
  }
};

export const GET_DURATION_FROM_FILTER_V2 = (filter: GameDuration) => {
  switch (filter) {
    case GameDuration.ALL:
      return null;
    case GameDuration.FAST:
      return 60 * 60;
    case GameDuration.MEDIUM:
      return 4 * 60 * 60;
    case GameDuration.EIGHT:
      return 8 * 60 * 60;
    case GameDuration.DAY:
      return 24 * 60 * 60;
    case GameDuration.WEEK:
      return 7 * 24 * 60 * 60;
    case GameDuration.MONTH:
      return 30 * 7 * 24 * 60 * 60;
    default:
      return null;
  }
};

export const GET_STATUS_FROM_FILTER = (filter?: FilterPlayerGame) => {
  switch (filter) {
    case FilterPlayerGame.ALL:
      return null;
    case FilterPlayerGame.Waiting:
      return 'Waiting';
    case FilterPlayerGame.Started:
      return 'Started';
    case FilterPlayerGame.Ended:
      return 'Ended';
    default:
      return null;
  }
};
