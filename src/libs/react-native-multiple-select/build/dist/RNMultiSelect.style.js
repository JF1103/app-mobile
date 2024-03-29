"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._doneButtonStyle =
  exports._menuItemTextStyle =
  exports._imageStyle =
  exports._menuButtonContainer =
  exports._menuBarContainer =
  exports._menuItemContainer =
  exports._placeholderTextStyle =
    void 0;
const react_native_1 = require("react-native");
const theme_1 = require("./theme");
exports._placeholderTextStyle = (theme, selectedItem) => ({
  height: 50,
  width: "80%",
  fontSize: 15,
  paddingLeft: 16,
  borderRadius: 16,
  fontWeight: "bold",
  backgroundColor: "#f4f6f8",
  color:
    selectedItem?.length > 0
      ? theme_1.ThemeColors[theme].textColor
      : theme_1.ThemeColors[theme].placeholderColor,
});
exports._menuItemContainer = () => ({
  paddingLeft: 8,
});
exports._menuBarContainer = (
  theme,
  menuBarContainerHeight = 200,
  menuBarContainerWidth,
) => ({
  borderBottomEndRadius: 16,
  borderBottomStartRadius: 16,
  height: menuBarContainerHeight,
  width: menuBarContainerWidth,
  paddingBottom: 12,
  backgroundColor: theme_1.ThemeColors[theme].menuBarBackgroundColor,
});
exports._menuButtonContainer = (theme, height = 75, width = 300) => ({
  width,
  height,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  justifyContent: "center",
  backgroundColor: theme_1.ThemeColors[theme].menuButtonBackgroundColor,
});
exports._imageStyle = (height = 25, width = 25) => ({
  width,
  height,
  right: 16,
});
exports._menuItemTextStyle = (theme) => ({
  color: theme_1.ThemeColors[theme].menuItemTextColor,
  fontWeight: "700",
});
exports._doneButtonStyle = (
  backgroundColor = "#2d67ff",
  shadowColor = "#2d67ff",
) => ({
  height: 50,
  width: "90%",
  marginTop: 8,
  backgroundColor,
  borderRadius: 16,
  alignSelf: "center",
  alignItems: "center",
  justifyContent: "center",
  shadowRadius: 8,
  shadowOpacity: 0.5,
  shadowColor,
  shadowOffset: {
    width: 0,
    height: 3,
  },
});
exports.default = react_native_1.StyleSheet.create({
  buttonContainerGlue: {
    marginLeft: 16,
    marginRight: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrowImageStyle: {
    width: 20,
    height: 20,
  },
  menuBarItemContainerGlue: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxContainerStyle: {
    width: 250,
  },
  arrowImageContainer: {
    padding: 12,
    borderWidth: 1,
    marginLeft: 12,
    borderRadius: 16,
    borderColor: "#e6e6e7",
  },
  doneButtonTextStyle: {
    color: "#fdfdfd",
    fontWeight: "bold",
  },
  listStyle: {
    marginTop: 3,
    marginBottom: 3,
  },
  spinnerContainer: {
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
//# sourceMappingURL=RNMultiSelect.style.js.map
