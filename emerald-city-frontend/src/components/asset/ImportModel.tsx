import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Box,
  DialogActions,
  Button,
  Paper,
  Typography,
  Container,
  Stack,
  TextField,
  Divider,
} from "@mui/material";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import React from "react";

import { FormikProps, useFormik } from "formik";
import Home from "@mui/icons-material/Home";
import styled from "@emotion/styled";
import { MapTypes, SidebarPanel, textureMaps } from "@src/types/Core";
import { api } from "@backend/types/api/Core";
import { setActiveSidebarPanel } from "@src/feature/activeSidebarPanelSlice";
import { useDispatch } from "react-redux";
import { uploadFile } from "@src/utils";

const ImportModel = () => {
  const [open, setOpen] = React.useState(true);
  const dispatch = useDispatch();

  const fileRef = React.useRef<HTMLInputElement>(null);

  const initialState: api.RequestModelProc = {
    modelName: "",
  };

  const formik: FormikProps<api.RequestModelProc> = useFormik({
    initialValues: initialState,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      const bucket: string = "emerald-city";

      if (
        fileRef.current &&
        fileRef.current.files &&
        fileRef.current.files[0]
      ) {
        await fetch("http://localhost:5000/get-presigned-post-url", {
          method: "POST",
          body: JSON.stringify({
            bucket,
            key: `models/${values.modelName}/model.fbx`,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then(({ url, fields }) =>
            uploadFile(url, fields, fileRef.current!.files![0])
          );

        await fetch("http://localhost:5000/model/request-model-proc", {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      dispatch(setActiveSidebarPanel(SidebarPanel.None));
      setSubmitting(false);
    },
  });

  return (
    <Dialog
      fullWidth={true}
      maxWidth="xl"
      open={open}
      onClose={() => {
        dispatch(setActiveSidebarPanel(SidebarPanel.None));
        setOpen(false);
      }}
    >
      <Paper>
        <form onSubmit={formik.handleSubmit}>
          <Container>
            <DialogTitle color="secondary">Upload Fbx Model</DialogTitle>
            <DialogContent>
              <DialogContentText>Select your Model File.</DialogContentText>
              <Container>
                <Stack
                  direction="row"
                  maxWidth="xl"
                  mt="1rem"
                  flexWrap="wrap"
                ></Stack>
                <Divider />
                <TextField
                  sx={{ mt: "1rem" }}
                  label="Model Name"
                  name="modelName"
                  onChange={formik.handleChange}
                  value={formik.values.modelName}
                />
                <input type="file" ref={fileRef} name="myImage" />
              </Container>
            </DialogContent>
          </Container>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Close</Button>
            <Button type="submit" disabled={formik.isSubmitting}>
              Submit
            </Button>
          </DialogActions>
        </form>
      </Paper>
    </Dialog>
  );
};

export default ImportModel;