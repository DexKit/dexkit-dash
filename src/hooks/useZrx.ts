import { useEffect, useMemo, useState } from 'react';

interface Props {
}

function useZrx() {

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState();



  return {loading, error, data};
}

export default useZrx;