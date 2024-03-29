"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_animated_spinkit_1 = require("react-native-animated-spinkit");
const react_native_bouncy_checkbox_1 = tslib_1.__importDefault(
  require("react-native-bouncy-checkbox"),
);
const react_native_bounceable_1 = tslib_1.__importDefault(
  require("@freakycoder/react-native-bounceable"),
);
/**
 * ? Local Imports
 */
const Icon_1 = tslib_1.__importDefault(require("./components/Icon/Icon"));
const RNMultiSelect_style_1 = tslib_1.__importStar(
  require("./RNMultiSelect.style"),
);
const theme_1 = require("./theme");
const RNMultiSelect = (props) => {
  const {
    data,
    width,
    height,
    darkMode,
    onSelect,
    imageWidth,
    imageHeight,
    placeholder,
    TextComponent,
    ImageComponent,
    doneButtonText,
    disableAbsolute,
    arrowImageStyle,
    menuItemTextStyle,
    onDoneButtonPress,
    multiSelectionText,
    doneButtonTextStyle,
    placeholderTextStyle,
    buttonContainerStyle,
    menuBarContainerStyle,
    menuBarContainerWidth,
    doneButtonShadowColor,
    disableFilterAnimation,
    menuBarContainerHeight,
    doneButtonBackgroundColor,
    Spinner = react_native_animated_spinkit_1.Chase,
    spinnerSize = 30,
    spinnerColor,
    ...rest
  } = props;
  let iconRef = undefined;
  const [theme, setTheme] = React.useState(theme_1.LIGHT);
  const [menuToggled, setMenuToggled] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState(Array());
  // ? Local Data Manipulation for Filtering
  const [dataBackup, setDataBackup] = React.useState(data);
  const [dataSource, setDataSource] = React.useState(data);
  // ? Animation States
  const [borderRadiusAnimation, setBorderRadiusAnimation] = React.useState(
    new react_native_1.Animated.Value(16),
  );
  const [menuBarOpenCloseAnimation, setMenuBarOpenCloseAnimation] =
    React.useState(new react_native_1.Animated.Value(100));
  // ? Lifecycle: componentDidMount
  React.useEffect(() => {
    setCurrentTheme();
  }, []);
  React.useEffect(() => {
    setDataSource(data);
    setDataBackup(data);
  }, [data]);
  React.useEffect(() => {
    onSelect && onSelect(selectedItems);
  }, [selectedItems.length]);
  React.useEffect(() => {
    setCurrentTheme();
  }, [darkMode]);
  const setCurrentTheme = () => {
    if (darkMode) setTheme(theme_1.DARK);
    else setTheme(theme_1.LIGHT);
  };
  const animateBorderRadius = () => {
    react_native_1.Animated.timing(borderRadiusAnimation, {
      toValue: menuToggled ? 16 : 0,
      duration: 1250,
      easing: react_native_1.Easing.bounce,
      useNativeDriver: true,
    }).start();
  };
  const animateSelectionBar = () => {
    react_native_1.Animated.timing(menuBarOpenCloseAnimation, {
      toValue: menuToggled ? 0 : 100,
      duration: 250,
      easing: react_native_1.Easing.ease,
      useNativeDriver: true,
    }).start();
  };
  const handleOnToggleMenuBar = (isMenuToggled) => {
    iconRef?.onPressAnimation();
    animateBorderRadius();
    animateSelectionBar();
    setMenuToggled(isMenuToggled ? isMenuToggled : !menuToggled);
  };
  const handleOnSelectItem = (item, checked) => {
    handleOnFilter("");
    item.isChecked = checked;
    if (checked) {
      const joined = selectedItems.concat(item);
      setSelectedItems(joined);
    } else {
      const index = selectedItems.findIndex((_item) => _item.id === item.id);
      if (index !== -1) {
        // Splice(Delete) the matched ID
        selectedItems.splice(index, 1);
        setSelectedItems(selectedItems);
      }
    }
  };
  const triggerFilterAnimation = () => {
    react_native_1.LayoutAnimation.configureNext({
      duration: 1000,
      create: {
        type: react_native_1.LayoutAnimation.Types.spring,
        property: react_native_1.LayoutAnimation.Properties.opacity,
        springDamping: 1,
      },
      delete: {
        type: react_native_1.LayoutAnimation.Types.spring,
        property: react_native_1.LayoutAnimation.Properties.opacity,
        springDamping: 1,
      },
    });
  };
  const handleOnFilter = (text) => {
    let newData = dataBackup;
    newData = dataBackup?.filter((item) => {
      const itemData = item.value.toLowerCase();
      const textData = text.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });
    !disableFilterAnimation && triggerFilterAnimation();
    setDataSource(newData);
  };
  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const renderSelectedText = () => {
    let _text = "";
    if (selectedItems.length === 0) {
      _text = placeholder || "";
    } else if (selectedItems.length > 2) {
      _text = `${selectedItems.length.toString()} ${
        multiSelectionText || "items Fueron seleccionado"
      }`;
    } else {
      selectedItems.map((item) => {
        _text = _text + `${item.value}, `;
      });
    }
    return <TextComponent>{_text}</TextComponent>;
  };
  const renderMainButton = () => {
    return (
      <react_native_1.View {...props}>
        <react_native_1.Animated.View
          style={[
            RNMultiSelect_style_1._menuButtonContainer(theme, height, width),
            {
              borderRadius: borderRadiusAnimation,
            },
            buttonContainerStyle,
          ]}
        >
          <react_native_1.View
            style={RNMultiSelect_style_1.default.buttonContainerGlue}
          >
            <react_native_1.TextInput
              style={[
                RNMultiSelect_style_1._placeholderTextStyle(
                  theme,
                  selectedItems,
                ),
                placeholderTextStyle,
              ]}
              placeholder={placeholder || ""}
              onFocus={() => handleOnToggleMenuBar(false)}
              placeholderTextColor={
                selectedItems
                  ? theme_1.ThemeColors[theme].textColor
                  : theme_1.ThemeColors[theme].placeholderColor
              }
              onChangeText={(text) => {
                if (text.length === 0) handleOnFilter("");
                else handleOnFilter(text);
              }}
            >
              {renderSelectedText()}
            </react_native_1.TextInput>
          </react_native_1.View>
        </react_native_1.Animated.View>
      </react_native_1.View>
    );
  };
  const renderMenuItem = (menuItem) => {
    const { value, isChecked, imageSource } = menuItem.item;
    return (
      <react_native_1.View style={RNMultiSelect_style_1._menuItemContainer()}>
        <react_native_1.View
          style={RNMultiSelect_style_1.default.menuBarItemContainerGlue}
        >
          <react_native_bouncy_checkbox_1.default
            text={value}
            fontSize={14}
            color="#fb8c00"
            borderRadius={8}
            fillColor="#fb8c00"
            borderColor="#eaeef1"
            unfillColor="#eaeef1"
            textDecoration="none"
            textStyle={menuItemTextStyle}
            {...props}
            isChecked={isChecked}
            style={RNMultiSelect_style_1.default.checkboxContainerStyle}
            onPress={(checked) => {
              handleOnSelectItem(menuItem.item, checked);
            }}
          />
          {imageSource && (
            <ImageComponent
              resizeMode="contain"
              source={imageSource}
              style={RNMultiSelect_style_1._imageStyle(imageHeight, imageWidth)}
            />
          )}
        </react_native_1.View>
      </react_native_1.View>
    );
  };
  const renderSpinner = () => (
    <react_native_1.View style={RNMultiSelect_style_1.default.spinnerContainer}>
      <Spinner
        {...rest}
        size={spinnerSize}
        color={spinnerColor || theme_1.ThemeColors[theme].textColor}
        isVisible={!(dataSource && dataSource.length > 0)}
      />
    </react_native_1.View>
  );
  const renderListContainer = () => {
    return (
      <>
        <react_native_1.FlatList
          data={dataSource}
          renderItem={renderMenuItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <react_native_bounceable_1.default
          onPress={() => {
            handleOnToggleMenuBar();
            onDoneButtonPress && onDoneButtonPress();
          }}
        ></react_native_bounceable_1.default>
      </>
    );
  };
  const renderMenuBar = () => {
    const rotate = menuBarOpenCloseAnimation.interpolate({
      inputRange: [0, 25, 50, 75, 100],
      outputRange: [0, 0.5, 0.75, 0.9, 1],
    });
    return (
      <react_native_1.Animated.View
        style={[
          RNMultiSelect_style_1._menuBarContainer(
            theme,
            menuBarContainerHeight,
            menuBarContainerWidth,
          ),
          {
            transform: [{ scaleY: rotate }],
            display: disableAbsolute ? "flex" : menuToggled ? "flex" : "none",
          },
          menuBarContainerStyle,
          /*   { height: 100 }, */
        ]}
      >
        {dataSource && dataSource.length > 0
          ? renderListContainer()
          : renderSpinner()}
      </react_native_1.Animated.View>
    );
  };
  return (
    <react_native_1.View>
      {renderMainButton()}
      {renderMenuBar()}
    </react_native_1.View>
  );
};
RNMultiSelect.defaultProps = {
  darkMode: false,
  TextComponent: react_native_1.Text,
  ImageComponent: react_native_1.Image,
  disableAbsolute: false,
  data: Array(),
};
exports.default = RNMultiSelect;
//# sourceMappingURL=RNMultiSelect.js.map
