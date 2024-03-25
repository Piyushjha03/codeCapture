
import { xcodeDark } from '@uiw/codemirror-theme-xcode';
import CodeMirror from '@uiw/react-codemirror';
import PropTypes from "prop-types";

export function CodeEditor(props) {

  return (
    <CodeMirror
      height={props.height}
      theme={xcodeDark}
      extensions={[]}
      value={props.value}
      onChange={(value) => {
        props.setOcrCode(value);
      }}
    />
  );
}
CodeEditor.propTypes = {
    height: PropTypes.string.isRequired,
    value: PropTypes.string,
    setOcrCode: PropTypes.func.isRequired,
  };