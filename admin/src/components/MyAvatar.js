// hooks
import { mediaBaseURL } from '../config';
import useAuth from '../hooks/useAuth';
// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { user } = useAuth();

  return (
    <Avatar
      src={user?.photoURL ? `${mediaBaseURL}/media/download/${user?.photoURL}` : ''}
      alt={user?.name}
      color={user?.photoURL ? 'default' : createAvatar(user?.name).color}
      {...other}
    >
      {createAvatar(user?.name).name}
    </Avatar>
  );
}
