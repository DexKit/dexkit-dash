import {useEffect, useMemo, useState} from 'react';

interface Props {
  date?: Date | Date[];
}

function useBlock({date}: Props) {
  const [blockCurrent, setBlockCurrent] = useState<number>();
  const [block07Days, setBlock07Days] = useState<number>();
  const [block15Days, setBlock15Days] = useState<number>();
  const [block30Days, setBlock30Days] = useState<number>();
  const [blocks, setBlocks] = useState<number[]>();

  useEffect(() => {
    if (date != null) {
    }
  }, [date]);

  return {blockCurrent, block07Days, block15Days, block30Days, blocks};
}

export default useBlock;
