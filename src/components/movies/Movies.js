import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Movie from './Movie';
import Pager from './Pager';
import ErrorModal from './ErrorModal';
import APIHelper from './helper/APIHelper';

// TODO why does modal only render on first error?
// TODO findDOMNode is deprecated in Strict Mode. react-bootstrap issue
const Movies = ({ totalPages, setTotalPages }) => {
   const [movies, setMovies] = useState([]);
   const [hasMore, setHasMore] = useState(false);
   const [requestFailed, setRequestFailed] = useState(false);
   const { query, page } = useParams();

   const fetchMovies = async (query, offset) => {
      try {
         const url = APIHelper.nyt_searchURL(query, offset);
         const response = await fetch(url);

         if (response.status === 200) {
            const data = await response.json();
            setRequestFailed(false);
            return data;
         } else if (response.status === 429) {
            setRequestFailed(true);
            return null;
         }
      } catch (error) {
         console.error(error);
      }
   };

   useEffect(() => {
      // send an empty string so we get results sorted in order of recency
      fetchMovies(query === 'recent' ? '' : query, (page - 1) * 20).then(
         data => {
            if (data === null) return;

            setMovies(
               data.results.map((result, index) => {
                  result.key = index; // TODO rethink how movies are keyed
                  return result;
               })
            );

            setHasMore(data.has_more);
            setTotalPages(pages =>
               Number(pages) < Number(page) ? page : pages
            );
         }
      );
   }, [query, page, setTotalPages]);

   return (
      <div className='movies-page'>
         <Pager
            hasMore={hasMore}
            query={query}
            page={page}
            totalPages={totalPages}
         />
         <div className='movies-container'>
            {movies.map(movie => (
               <Movie key={movie.key} movie={movie} />
            ))}
         </div>
         <Pager
            hasMore={hasMore}
            query={query}
            page={page}
            totalPages={totalPages}
         />
         {requestFailed && <ErrorModal visible={requestFailed} />}
      </div>
   );
};

export default Movies;
