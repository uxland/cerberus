import {Mediator} from 'mediatr-ts';
import {useState} from 'react';
import {UploadOrganizationStructureFile} from './command.ts';

export const OrganizationalStructureFileUploader = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const submit = async (event) => {
    setError('');
    event.preventDefault();
    setUploading(true);
    try {
      await new Mediator().send(new UploadOrganizationStructureFile(file));
    } catch (e) {
      setError(e.message || e.toString());
    } finally {
      setUploading(false);
    }
  };


  return (
    <form onSubmit={submit}>
      <h1>Pick a file</h1>
      <input type='file' onChange={(e) => setFile(e.target.files[0])} />
      <button type='submit' disabled={!file}>
        Submit
      </button>
      {error ? <h1>{error}</h1> : null}
      {uploading ? <h3>wait</h3> : null}
    </form>
  );
};
