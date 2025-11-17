import { useParams, useNavigate, useLocation } from 'react-router-dom';

export default function withRouter(Component) {
  return function Wrapper(props) {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    return <Component {...props} params={params} navigate={navigate} location={location} />;
  }
}
