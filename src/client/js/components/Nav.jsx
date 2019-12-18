import React, { Fragment, useState, createRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
  Container,
  Grid,
  AppBar,
  makeStyles,
  Typography,
  Button,
  ButtonGroup,
  Menu,
  MenuItem
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { useHistory } from "react-router-dom";

import { theme } from "../../styles/theme";

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  hc: {
    height: "60px"
  },
  hcg: {
    height: "100%"
  }
});

function PipelineDropdown(props) {
  const { anchorEl, handleClose, dropdown } = props;
  const refs = dropdown.jobIds.map(() => createRef());
  const history = useHistory();
  const handleClick = jobId => {
    handleClose();
    history.push(`/pipelines/123/jobs/${jobId}`);
  };
  useEffect(() => {
    if (history.location.pathname.match(/\/jobs\/(.+)/)) {
      const idx = dropdown.jobIds.findIndex(x => `${x}` === history.location.pathname.match(/\/jobs\/(.+)/)[1]);
      if (idx >= 0) {
        refs.forEach(x => x.current && (x.current.style.background = ""));
        refs[idx].current &&
          (refs[idx].current.style.background = theme.palette.secondary.main);
      }
    }
  });
  return (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      style={{ marginTop: "45px" }}
    >
      {dropdown.jobIds.map((x, i) => (
        <MenuItem key={i} onClick={() => handleClick(x, i)} ref={refs[i]}>
          Job{x}
        </MenuItem>
      ))}
    </Menu>
  );
}
PipelineDropdown.propTypes = {
  anchorEl: PropTypes.object,
  handleClose: PropTypes.func,
  dropdown: PropTypes.object
};

export default function Nav() {
  const classes = useStyles();
  const counter = useSelector(state => state.counter);
  const [jobAnchor, setJobAnchor] = useState(null);
  const tabs = [
    { pathname: "/", label: "Home" },
    { pathname: "/demo1", label: "Demo1" },
    {
      pathname: "/pipelines/123",
      label: "Pipelines",
      dropdown: {
        pathname: "/pipelines/123/jobs/:jobId",
        jobIds: [123, 456, 789]
      }
    },
    { pathname: `/demo2/${counter.value}`, label: "Demo2" }
  ];
  const history = useHistory();
  return (
    <Fragment>
      <Container className={classes.hc} maxWidth="md">
        <Grid className={classes.hcg} container alignItems="flex-end">
          <Typography variant="h4" onClick={() => history.push("/")}>
            Type 18 hek
          </Typography>
        </Grid>
      </Container>
      <AppBar position="static" className={classes.root}>
        <Container maxWidth="md">
          <Grid
            container
            style={{ width: "100%", height: "50px" }}
            alignItems="center"
          >
            <Grid container justify="center">
              {tabs.map((x, i) => (
                <Fragment key={i}>
                  <ButtonGroup
                    style={{
                      margin: "0 20px"
                    }}
                  >
                    <Button
                      variant="contained"
                      color={
                        x.pathname === history.location.pathname ? "secondary" : "default"
                      }
                      onClick={() => history.push(x.pathname)}
                      style={{
                        fontWeight: "bold",
                        textTransform: "none"
                      }}
                    >
                      {x.label}
                    </Button>
                    {x.label === "Pipelines" ? (
                      <Button
                        variant="contained"
                        color={
                          x.pathname === "Pipelines" ? "secondary" : "default"
                        }
                        style={{ width: "20px" }}
                        onClick={e => setJobAnchor(e.target)}
                      >
                        <ArrowDropDownIcon />
                      </Button>
                    ) : (
                        ""
                      )}
                  </ButtonGroup>
                  {x.label === "Pipelines" ? (
                    <PipelineDropdown
                      anchorEl={jobAnchor}
                      handleClose={() => setJobAnchor(null)}
                      dropdown={x.dropdown}
                    />
                  ) : (
                      ""
                    )}
                </Fragment>
              ))}
            </Grid>
          </Grid>
        </Container>
      </AppBar>
    </Fragment>
  );
}
