import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";
import MailIcon from "@mui/icons-material/Mail";
import DeleteIcon from "@mui/icons-material/Delete";
import Label from "@mui/icons-material/Label";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import InfoIcon from "@mui/icons-material/Info";
import ForumIcon from "@mui/icons-material/Forum";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { SvgIconProps } from "@mui/material/SvgIcon";
import { SceneObject, SceneObjectType } from "@src/core/SceneGraph";
import { useEngineContext } from "@src/contexts/EngineContext";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import ThreeDRotationRoundedIcon from "@mui/icons-material/ThreeDRotationRounded";
import ViewInArRoundedIcon from "@mui/icons-material/ViewInArRounded";
import VideoCameraBackRoundedIcon from "@mui/icons-material/VideoCameraBackRounded";
import QuestionMarkRoundedIcon from "@mui/icons-material/QuestionMarkRounded";
import {
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

declare module "react" {
  interface CSSProperties {
    "--tree-view-color"?: string;
    "--tree-view-bg-color"?: string;
  }
}

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightRegular,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: "var(--tree-view-color)",
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: "inherit",
      color: "inherit",
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

function StyledTreeItem(props: StyledTreeItemProps) {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
          <Typography
            variant="body2"
            sx={{ fontWeight: "inherit", flexGrow: 1 }}
          >
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor,
      }}
      {...other}
    />
  );
}

const getSceneObjectIcon = (sceneObjectType: SceneObjectType) => {
  switch (sceneObjectType) {
    case SceneObjectType.Level:
      return MapRoundedIcon;
    case SceneObjectType.MeshObject:
      return ThreeDRotationRoundedIcon;
    case SceneObjectType.Light:
      return LightModeRoundedIcon;
    case SceneObjectType.Camera:
      return VideoCameraBackRoundedIcon;
    default:
      return QuestionMarkRoundedIcon;
      break;
  }
};

const getWorldOutliner = (node: SceneObject) => {
  console.log("FFFFFF");
  if (node.childrens.length === 0)
    return (
      <StyledTreeItem
        nodeId="1"
        labelText={node.name}
        labelIcon={getSceneObjectIcon(node.type)}
      ></StyledTreeItem>
    );

  return (
    <StyledTreeItem
      nodeId={node.id}
      labelText={node.name}
      labelIcon={getSceneObjectIcon(node.type)}
    >
      {node.childrens.map((_node) => getWorldOutliner(_node))}
    </StyledTreeItem>
  );
};

export default function WorldOutliner() {
  let engine = useEngineContext();
  const [needsUpdate, setNeedsUpdate] = React.useState<boolean>(false);

  React.useEffect(() => {
    const callbackID = engine.sceneGraph.registerOnChangeCallback(() => {
      setNeedsUpdate(true);
    });
    return () => engine.sceneGraph.removeOnChangeCallback(callbackID);
  }, []);

  return (
    <>
      <Divider />
      <ListItemButton sx={{ height: 56 }}>
        <ListItemIcon>
          <ViewInArRoundedIcon color="primary" />
        </ListItemIcon>
        <ListItemText
          primary="World Outliner"
          primaryTypographyProps={{
            color: "primary",
            fontWeight: "medium",
            variant: "body2",
          }}
        />
      </ListItemButton>
      <Divider />
      {engine.sceneGraph.root && (
        <TreeView
          aria-label="gmail"
          defaultExpanded={[engine.sceneGraph.root.id]}
          defaultCollapseIcon={<ArrowDropDownIcon />}
          defaultExpandIcon={<ArrowRightIcon />}
          defaultEndIcon={<div style={{ width: 24 }} />}
          sx={{
            //  height: 264,
            flexGrow: 1,
            //maxWidth: 400,
            pt: "1rem",
            overflowY: "auto",
          }}
        >
          {/*           <StyledTreeItem
            nodeId="1"
            labelText="All Mail"
            labelIcon={MailIcon}
          />
          <StyledTreeItem nodeId="2" labelText="Trash" labelIcon={DeleteIcon} />
          <StyledTreeItem nodeId="3" labelText="Categories" labelIcon={Label}>
            <StyledTreeItem
              nodeId="5"
              labelText="Social"
              labelIcon={SupervisorAccountIcon}
              labelInfo="90"
              color="#1a73e8"
              bgColor="#e8f0fe"
            />
            <StyledTreeItem
              nodeId="6"
              labelText="Updates"
              labelIcon={InfoIcon}
              labelInfo="2,294"
              color="#e3742f"
              bgColor="#fcefe3"
            />
            <StyledTreeItem
              nodeId="7"
              labelText="Forums"
              labelIcon={ForumIcon}
              labelInfo="3,566"
              color="#a250f5"
              bgColor="#f3e8fd"
            />
            <StyledTreeItem
              nodeId="8"
              labelText="Promotions"
              labelIcon={LocalOfferIcon}
              labelInfo="733"
              color="#3c8039"
              bgColor="#e6f4ea"
            />
          </StyledTreeItem>
          <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} /> */}
          {engine.sceneGraph.root && getWorldOutliner(engine.sceneGraph.root)}
        </TreeView>
      )}
      <Box py="2rem" />
      <Divider />
    </>
  );
}
