import { useState, useEffect, Fragment } from "react";
import {
  Stack,
  Typography,
  Box,
  IconButton,
  Divider,
  CircularProgress,
  useTheme,
  Button,
  styled,
  Tooltip,
} from "@material-ui/core";
import {
  ArrowBack as BackIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkedIcon,
  PlayArrow as PlayIcon,
} from "@material-ui/icons";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

const AlignCenterBox = styled(Box)(({ theme }) => ({
  ...theme.mixins.alignInTheCenter,
}));

const Definition = ({ bookmarks, addBookmark, removeBookmark }) => {
  const { word } = useParams();
  const history = useHistory();
  // const [definitions, setDefinitions] = useState([]);
  // const [nouns, setNouns] = useState([]);
  const [rootInfo, setRootInfo] = useState({});
  const [exist, setExist] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [successfullyConnected, setSuccessfullyConnected] = useState(false);
  const [error, setError] = useState(null);
  // const [audio, setAudio] = useState(null);

  const isBookmarked = Object.keys(bookmarks).includes(word);

  const updateState = (data) => {
    console.log("update state Data: " + JSON.stringify(data));
    setRootInfo({
      definitions: data["definitions"],
      nouns: data["nouns"],
    });
    console.log("Succcessfully updated root info");
    // setDefinitions(data["definition"]);
    // setNouns(data["nouns"]);
    // console.log("New def:" + JSON.stringify(definitions));
    // const phonetics = data[0].phonetics;
    // if (!phonetics.length) return;
    // const url = phonetics[0].audio.replace("//ssl", "https://ssl");
    // setAudio(new Audio(url));
  };
  useEffect(() => {
    const fetchDefinition = async () => {
      try {
        const resp = await axios.get(`https://hanswehr.com/root?root=${word}`);
        console.log(JSON.stringify(resp.data));
        // console.log("RESPONSE: ", JSON.stringify(resp));
        updateState(resp.data["data"]);
        // updateState()
        setSuccessfullyConnected(true);
        setExist(true);
        setLoaded(true);
        // console.log("Set to true");
      } catch (err) {
        console.error(err);
        setError(err);
        if (!err.response) {
          setSuccessfullyConnected(false);
        } else {
          setSuccessfullyConnected(true);
        }
        setExist(false);
        setLoaded(true);
        // console.log("Set to false");
      }
    };

    // fetchDefinition();
    if (!isBookmarked) fetchDefinition();
    else {
      console.log("Bookmarked word: " + JSON.stringify(bookmarks[word]));
      updateState(bookmarks[word]);
      setSuccessfullyConnected(true);
      setExist(true);
      setLoaded(true);
    }
  }, []);

  // console.log("Root info: " + JSON.stringify(rootInfo));
  // console.log("Definitions length: " + Object.keys(definitions).length);
  // console.log("Exist: " + JSON.stringify(exist));

  if (!loaded)
    return (
      <AlignCenterBox>
        <CircularProgress />
      </AlignCenterBox>
    );

  if (!successfullyConnected)
    return (
      <AlignCenterBox>
        <Typography>
          Error connecting to API
          {JSON.stringify(error)}
        </Typography>
        <Button
          variant="contained"
          sx={{ textTransform: "capitalize", mt: 2 }}
          onClick={history.goBack}
        >
          <b>Go back</b>
        </Button>
      </AlignCenterBox>
    );

  if (!exist) {
    return (
      <AlignCenterBox>
        <Typography>Word not found</Typography>
        <Button
          variant="contained"
          sx={{ textTransform: "capitalize", mt: 2 }}
          onClick={history.goBack}
        >
          Go back
        </Button>
      </AlignCenterBox>
    );
  }

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <IconButton onClick={history.goBack}>
          <BackIcon sx={{ color: "black" }} />
        </IconButton>
        <IconButton
          onClick={() =>
            isBookmarked ? removeBookmark(word) : addBookmark(word, rootInfo)
          }
        >
          {isBookmarked ? (
            <BookmarkedIcon sx={{ color: "black" }} />
          ) : (
            <BookmarkIcon sx={{ color: "black" }} />
          )}
        </IconButton>
      </Stack>
      <Tooltip title="Root">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mt: 3,
            background:
              "linear-gradient(90.17deg, #191E5D 0.14%, #161F75 98.58%)",
            boxShadow: "0px 10px 20px rgba(19, 23, 71, 0.25)",
            px: 4,
            py: 5,
            color: "white",
            borderRadius: 2,
          }}
        >
          <Typography sx={{ textTransform: "capitalize" }} variant="h5">
            {word}
          </Typography>
          {/* {
            <IconButton>
              <PlayIcon />
            </IconButton>
          } */}
        </Stack>
      </Tooltip>

      <Fragment key={1}>
        <Divider sx={{ display: "none", my: 3 }} />

        {Object.keys(rootInfo["definitions"]).map((form, i) => (
          // <Tooltip title={`Verb Form ${form}`}>
          <Box
            key={Math.random()}
            sx={{
              boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.05)",
              backgroundColor: "#fff",
              p: 2,
              borderRadius: 2,
              mt: 3,
            }}
          >
            <Typography
              sx={{ textTransform: "capitalize" }}
              color="GrayText"
              variant="subtitle1"
            >
              {form}
            </Typography>
            <Typography
              sx={{ my: 1 }}
              variant="body2"
              color="GrayText"
              key={rootInfo["definitions"][form]}
            >
              {/* { {meaning.definitions.length > 1 && `${idx + 1}. `}{" "}} */}
              {rootInfo["definitions"][form]}
            </Typography>
          </Box>
          // </Tooltip>
        ))}
      </Fragment>

      <Fragment key={2}>
        <Divider sx={{ display: "block", my: 3 }} />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mt: 3,
            background:
              "linear-gradient(90.17deg, #212BBB 0.14%, #0F133A 98.58%)",
            boxShadow: "0px 10px 20px rgba(19, 23, 71, 0.25)",
            px: 4,
            py: 5,
            color: "white",
            borderRadius: 2,
          }}
        >
          <Typography sx={{ textTransform: "capitalize" }} variant="h6">
            Nouns
          </Typography>
          {/* {
          <IconButton>
            <PlayIcon />
          </IconButton>
        } */}
        </Stack>

        {rootInfo["nouns"] &&
          rootInfo["nouns"].map((noun, i) => (
            <Box
              key={Math.random()}
              sx={{
                boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.05)",
                backgroundColor: "#fff",
                p: 2,
                borderRadius: 2,
                mt: 3,
              }}
            >
              <Typography
                sx={{ textTransform: "capitalize" }}
                color="GrayText"
                variant="subtitle1"
              >
                {rootInfo["nouns"][i]["word"]}
              </Typography>
              <Typography
                sx={{ my: 1 }}
                variant="body2"
                color="GrayText"
                key={i}
              >
                {/* { {meaning.definitions.length > 1 && `${idx + 1}. `}{" "}} */}
                {rootInfo["nouns"][i]["definition"]}
              </Typography>
            </Box>
          ))}
      </Fragment>

      {/* 
      <Fragment key={123}>
        <Divider sx={{ display: "block", my: 3 }} />
        <b>Definition</b>
        {exist &&
          Object.keys(definitions).forEach((form) => {
            const formNumber = formToInt[form];
            return (
              <Box
                key={Math.random()}
                sx={{
                  boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.05)",
                  backgroundColor: "#fff",
                  p: 2,
                  borderRadius: 2,
                  mt: 3,
                }}
              >
                <Typography
                  sx={{ textTransform: "capitalize" }}
                  color="GrayText"
                  variant="subtitle1"
                >
                  {form}
                </Typography>
                <Typography
                  sx={{ my: 1 }}
                  variant="body2"
                  color="GrayText"
                  key={definitions[form]}
                >
                  { {meaning.definitions.length > 1 && `${idx + 1}. `}{" "}}
                  {definitions[form]}
                </Typography>
              </Box>
            );
            console.log("Form: " + form + " Def: " + definitions[form]);
          })}
      </Fragment> */}

      {/* {definitions.map((def, idx) => (
        <Fragment key={idx}>
          <Divider sx={{ display: idx === 0 ? "none" : "block", my: 3 }} />
          {def.meanings.map((meaning) => (
            <Box
              key={Math.random()}
              sx={{
                boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.05)",
                backgroundColor: "#fff",
                p: 2,
                borderRadius: 2,
                mt: 3,
              }}
            >
              <Typography
                sx={{ textTransform: "capitalize" }}
                color="GrayText"
                variant="subtitle1"
              >
                {meaning.partOfSpeech}
              </Typography>
              {meaning.definitions.map((definition, idx) => (
                <Typography
                  sx={{ my: 1 }}
                  variant="body2"
                  color="GrayText"
                  key={definition.definition}
                >
                  {meaning.definitions.length > 1 && `${idx + 1}. `}{" "}
                  {definition.definition}
                </Typography>
              ))}
            </Box>
          ))}
        </Fragment>
      ))} */}
    </>
  );
};

const formToInt = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
  IX: 9,
  X: 10,
};

export default Definition;
