import {Mediator} from 'mediatr-ts';
import {useEffect, useState} from 'react';
import {HierarchyItemType} from '../../../state/hierarchy-item.ts';
import {LocationSettings} from './model.ts';
import {GetLocationSettings} from './query.ts';
export const SettingsView = (props: {
  id: string;
  type: HierarchyItemType;
  content: (settings: LocationSettings) => JSX.Element;
}) => {
  const [settings, setSettings] = useState<LocationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const settings = await new Mediator().send(
          new GetLocationSettings(props.id, props.type)
        );
        setSettings(settings);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData().then(() => console.log('done'));
  }, [props.id, props.type]);
  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {settings && props.content(settings)}
    </div>
  );
};
