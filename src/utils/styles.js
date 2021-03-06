import { StyleSheet, Platform, StatusBar } from 'react-native';

export const colors = {
  white: '#ffffff',
  blue: '#2980b9',
  lightGrey: '#e2e6ea',
  darkGrey: '#212529',
  success: '#2ecc71',
  error: '#e74c3c',
  warning: '#f39c12',
  btnBg: '#dae0e5',
  primary: '#4776E6',
  secondary: '#8E54E9',
  tertiary: '#2ecc71',
  tertiaryAlt: '#27ae60',
};

export const fontSize = 18;
export const iconSize = 22;
export const btnTxtSize = 18;
export const fontColorLight = colors.white;
export const fontColorDark = colors.darkGrey;
export const gutter = 10;
export const borderRadius = 5;
export const headerHeight = Platform.OS === 'ios' ? 56 : 56;

export const btnDefault = {
  position: 'relative',
  width: '100%',
  padding: gutter,
  paddingTop: gutter + 4,
  paddingBottom: gutter + 4,
  marginTop: gutter,
  marginBottom: gutter,
  borderRadius,
  borderWidth: 1,
  borderColor: colors.primary,
  backgroundColor: colors.btnBg,
};

export const textInputLight = {
  fontSize: fontSize,
  borderBottomWidth: 1,
  borderColor: colors.primary,
  padding: gutter,
  marginTop: gutter,
  marginBottom: gutter,
};

export const styles = {
  iconSize: iconSize,
  appBackgroundColors: [colors.primary, colors.secondary],
  statusBarHeight: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight,

  container: {
    flex: 1,
    padding: gutter,
    justifyContent: 'center',
    alignContent: 'center',
  },

  linkTxt: {
    textDecorationLine: 'underline',
  },

  header: {
    position: 'relative',
    height: headerHeight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerText: {
    fontSize: fontSize,
    fontWeight: '800',
    textAlign: 'center',
  },

  btnTxtDefault: {
    fontSize: btnTxtSize,
    textAlign: 'center',
  },

  alertBoxDefault: {
    padding: gutter,
    marginTop: gutter,
    marginBottom: gutter,
    backgroundColor: colors.warning,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    shadowOffset: { height: 2, width: 0 },
    shadowColor: '#000000',
    shadowOpacity: 0.6,
    elevation: 5,
    position: 'relative',
  },

  modalBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalStyle: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    elevation: 5,
    shadowOffset: { height: 4, width: 0 },
    shadowColor: '#000000',
    shadowOpacity: 0.6,
    width: '90%',
    height: 'auto',
  },
  modalTitle: {
    fontSize: fontSize,
    fontWeight: 'bold',
  },
};

export const bold = { fontWeight: 'bold' };
export const typography = StyleSheet.create({
  h1: {
    ...bold,
    fontSize: 32,
  },
  h2: {
    ...bold,
    fontSize: 26,
  },
  h3: {
    ...bold,
    fontSize: 22,
  },
  h4: {
    ...bold,
    fontSize: 18,
  },
  h5: {
    ...bold,
    fontSize: 16,
  },
  h6: {
    ...bold,
    fontSize: 12,
  },
  para: {
    fontSize,
    fontWeight: 'normal',
  },
  italic: {
    fontSize,
    fontStyle: 'italic',
  },
});

export const buttons = StyleSheet.create({
  default: {
    ...btnDefault,
  },
  primary: {
    ...btnDefault,
    ...{
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
  },
  secondary: {
    ...btnDefault,
    ...{
      backgroundColor: colors.secondary,
      borderColor: colors.secondary,
    },
  },
  tertiary: {
    ...btnDefault,
    backgroundColor: colors.tertiary,
    borderColor: colors.tertiary,
    borderBottomColor: colors.tertiaryAlt,
    borderBottomWidth: 5,
  },
  link: {
    ...btnDefault,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  textLink: {
    ...styles.btnTxtDefault,
    textDecorationLine: 'underline',
  },
  textLight: {
    ...styles.btnTxtDefault,
  },
  textDark: {
    ...styles.btnTxtDefault,
    fontSize: btnTxtSize,
  },
});

export const textInputs = StyleSheet.create({
  default: {
    ...textInputLight,
  },
  error: {
    ...textInputLight,
    borderColor: colors.error,
  },
});

export const alertBoxes = StyleSheet.create({
  default: {
    ...styles.alertBoxDefault,
  },
  error: {
    ...styles.alertBoxDefault,
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  info: {
    ...styles.alertBoxDefault,
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  alertText: {
    fontSize: 14,
  },
});