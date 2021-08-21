import React, {
  PropsWithChildren,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Grid,
  Typography,
  Accordion,
  // AccordionSummary,
  AccordionDetails,
  AccordionActions,
} from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import ArrowDownwardOutlinedIcon from '@material-ui/icons/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@material-ui/icons/ArrowUpwardOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {AccordionSummary} from '../../shared/Accordion';
import {CollectionComponentItem} from './collectionComponentItem';
import {CustomIconButton} from '../../shared/Buttons';
import {truncateAddress} from 'utils/text';
import {Collection} from 'types/myApps';
// import { CollectionInfo } from 'types/opensea/collectionInfo.interface';
import {GridContainer} from '@crema';
import {ClassNameMap} from '@material-ui/core/styles/withStyles';
interface CollectionComponentListProps {
  readonly collections: Collection[];
  readonly editable: boolean;
  valid: boolean;
  classes: ClassNameMap<'heading'>;
  uniqueCheck: (address: string) => boolean;
  // update: (collections: CollectionInfo[] | Collection[]) => void;
  onChange: (
    $event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    collection: Collection,
    index: number,
  ) => void;
  validator: (isValid: boolean) => void;
}

type Props = PropsWithChildren<CollectionComponentListProps>;
export function CollectionComponentList(props: Props) {
  const {
    collections: startCollections,
    editable,
    valid,
    classes,
    uniqueCheck,
    // update,
    onChange,
    validator,
  } = props;
  const [collections, setCollections] = useState(startCollections);

  const addCollection = useCallback(
    ($e?: SyntheticEvent, index?: number) => {
      if ($e != null) {
        $e.preventDefault();
        $e.stopPropagation();
      }
      if (!Boolean(editable) && collections?.length > 0) {
        return;
      }
      const newItem = {
        name: '',
        imageUrl: '',
        slug: '',
        description: '',
        address: '',
        assetCount: 0,
        id: '',
      };
      if (index != null && index > 0 && index < (collections?.length ?? 0)) {
        collections.splice(index, 0, newItem);
        setCollections([...collections]);
        return;
      }
      setCollections([...(collections ?? []), newItem]);
    },
    [collections, setCollections, editable],
  );

  const remCollection = useCallback(
    (index: number, $e?: SyntheticEvent) => {
      if ($e != null) {
        $e.preventDefault();
        $e.stopPropagation();
      }
      if (!Boolean(editable)) {
        return;
      }
      if (index >= 0 && index < collections?.length) {
        collections.splice(index, 1);
        const _collections = [...collections];
        setCollections(_collections);
      }
    },
    [collections, setCollections, editable],
  );

  const sortCollection = useCallback(
    (index: number, action: 'UP' | 'DOWN', $e?: SyntheticEvent) => {
      if ($e != null) {
        $e.preventDefault();
        $e.stopPropagation();
      }
      if (!Boolean(editable)) {
        return;
      }
      const direction = action === 'UP' ? -1 : 0;
      const removed = collections.splice(index + direction, 1);
      if (action === 'UP') {
        collections.splice(index, 0, ...removed);
      } else {
        collections.splice(index + 1, 0, ...removed);
      }
      const _collections = [...collections];
      setCollections(_collections);
    },
    [collections, setCollections, editable],
  );

  // useEffect(() => {
  //   update(collections);
  // }, [collections]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {collections != null
        ? collections?.map((collection: Collection, i: number) => (
            <Grid item xs={12} md={12} sm={12}>
              <Accordion defaultExpanded={!Boolean(collection?.address)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-label='Expand'
                  aria-controls={`accordion-summary-${i}`}
                  id={`accordion-summary-${i}`}>
                  <Typography
                    className={classes.heading}
                    variant='subtitle2'
                    component='h2'>
                    {`${collection?.name ?? collection?.slug} ${truncateAddress(
                      collection?.address,
                    )}`}
                  </Typography>
                  <AccordionActions>
                    <CustomIconButton
                      aria-label={`add(${i})`}
                      onClick={($e) => addCollection($e, i)}
                      disabled={Boolean(editable) ? !valid : true}>
                      <AddCircleOutlineOutlinedIcon fontSize='small' />
                    </CustomIconButton>
                    {i > 0 ? (
                      <>
                        <CustomIconButton
                          key={`delete(${new Date().getTime()})`}
                          aria-label={`delete(${i})`}
                          disabled={!Boolean(editable)}
                          onClick={($e) => remCollection(i, $e)}>
                          <DeleteOutlinedIcon fontSize='small' />
                        </CustomIconButton>
                        <CustomIconButton
                          key={`up(${i})`}
                          aria-label={`up(${i})`}
                          onClick={($e) => sortCollection(i, 'UP', $e)}
                          disabled={!Boolean(editable)}>
                          <ArrowUpwardOutlinedIcon fontSize='small' />
                        </CustomIconButton>
                        <CustomIconButton
                          key={`down(${i})`}
                          aria-label={`down(${i})`}
                          disabled={
                            Boolean(editable)
                              ? Boolean(i >= collections?.length - 1)
                              : true
                          }
                          onClick={($e) => sortCollection(i, 'DOWN', $e)}>
                          <ArrowDownwardOutlinedIcon fontSize='small' />
                        </CustomIconButton>
                      </>
                    ) : (
                      <>
                        <CustomIconButton
                          key={`up(${i})`}
                          aria-label={`up(${i})`}
                          disabled={true}>
                          <ArrowUpwardOutlinedIcon fontSize='small' />
                        </CustomIconButton>
                        <CustomIconButton
                          key={`down(${i})`}
                          aria-label={`down(${i})`}
                          disabled={
                            Boolean(editable)
                              ? Boolean(i >= collections?.length - 1)
                              : true
                          }
                          onClick={($e) => sortCollection(i, 'DOWN', $e)}>
                          <ArrowDownwardOutlinedIcon fontSize='small' />
                        </CustomIconButton>
                      </>
                    )}
                  </AccordionActions>
                </AccordionSummary>
                <AccordionDetails>
                  <GridContainer>
                    <CollectionComponentItem
                      key={Math.round(Math.random() * 1000 + i)}
                      index={i}
                      data={collection}
                      onChange={onChange}
                      validator={validator}
                      isValid={valid}
                      editable={editable}
                      uniqueCheck={uniqueCheck}
                    />
                  </GridContainer>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))
        : null}
    </>
  );
}
