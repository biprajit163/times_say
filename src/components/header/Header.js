import './Header.css';

import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Search from './Search';

const Header = ({ setTotalPages }) => {
   const [disabled, setDisabled] = useState(false);
   const [query, setQuery] = useState('');

   const history = useHistory();

   const handleClick = () => {
      setDisabled(false);
      setTotalPages(0);
      setQuery('');
      history.push('/');
   };

   return (
      <header>
         <h1 onClick={handleClick}>What does the Times say?</h1>
         <Search
            query={query}
            setQuery={setQuery}
            setTotalPages={setTotalPages}
            disabled={disabled}
            setDisabled={setDisabled}
         />
      </header>
   );
};

export default Header;
