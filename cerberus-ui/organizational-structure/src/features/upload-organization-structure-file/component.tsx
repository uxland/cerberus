import {Button, CircularProgress, Typography} from '@mui/material';
import {Mediator} from 'mediatr-ts';
import {MuiFileInput} from 'mui-file-input';
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

  // return (
  //   <>
  //     <form onSubmit={submit}>
  //       <h1>Pick a file</h1>
  //       <input type='file' onChange={(e) => setFile(e.target.files[0])} />
  //       <button type='submit' disabled={!file}>
  //         Submit
  //       </button>
  //       {error ? <h1>{error}</h1> : null}
  //       {uploading ? <h3>wait</h3> : null}
  //     </form>

  //     <MuiFileInput
  //       value={file}
  //       label='Pick a file'
  //       variant='outlined'
  //       color='secondary'
  //       onChange={(e) => setFile(e.target.files[0])}
  //     />
  //     <Button variant='outlined' size='medium' disabled={!file} type='submit'>
  //       Submit
  //     </Button>
  //   </>
  // );
  const handleFileChange = (newFile) => {
    setFile(newFile);
  };
  return (
    <form onSubmit={submit}>
      <Typography variant='h4' component='h1' gutterBottom>
        Pick a file
      </Typography>
      <div className='flex gap-4 w-[500px] items-end'>
        <div className='flex items-center justify-center w-80'>
          {uploading ? (
            <CircularProgress style={{marginTop: 16, color: '#fff'}} />
          ) : (
            <MuiFileInput
              value={file}
              variant='outlined'
              color='secondary'
              size='small'
              onChange={handleFileChange}
              inputProps={{accept: '.xlsx,.xls'}}
              fullWidth
              margin='normal'
              placeholder='Update a .xlsx,.xls file'
            />
          )}
        </div>
        <Button
          variant='contained'
          size='small'
          disabled={!file || uploading}
          type='submit'
          fullWidth
          className='submit-btn flex-1'>
          Submit
        </Button>
        {error && (
          <Typography variant='h6' color='error' component='h1'>
            {error}
          </Typography>
        )}
      </div>
      {/* {uploading && <CircularProgress style={{marginTop: 16, color: 'pink'}} />} */}
    </form>
  );
};
