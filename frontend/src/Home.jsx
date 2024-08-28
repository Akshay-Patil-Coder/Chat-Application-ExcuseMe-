import { Badge,Form} from "react-bootstrap";
export default function Home() {
  return (
    <div className="cols-2column">
      <div className="firsthome">
        <h4>
          {/* <Form.Label>React</Form.Label> */}
          Hello This Is <Badge bg="secondary">contact page</Badge>

        </h4>
      </div>
      <div className="secondhome">
        <h4>
          Hello This Is <Badge bg="secondary">chat page</Badge>
        </h4>
      </div>
    </div>
  );
}
