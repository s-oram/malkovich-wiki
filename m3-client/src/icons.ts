import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
    faCheckSquare,
    faCoffee,
    faEdit,
    faSync,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';

// More icons:
// https://fontawesome.com/icons?d=gallery&s=solid&m=free


// Use icons:
//
//    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//
//    <FontAwesomeIcon icon="sync" size="xs"></FontAwesomeIcon>


function init() {
    library.add(
        fab,
        faCheckSquare,
        faCoffee,
        faEdit,
        faSync,
        faSpinner,
    );
}

export default { init }