import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native'

interface ActionButtonProps {
  title: string
  onPress: () => void
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
}

export function ActionButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
}: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{disabled, busy: loading}}
      disabled={disabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        styles[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator
            color="#FFFFFF"
            size="small"
            style={styles.spinner}
          />
        )}
        <Text style={[styles.label, variant === 'secondary' && styles.secondaryLabel]}>
          {title}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: 8,
  },
  primary: {
    backgroundColor: '#E31B23',
  },
  secondary: {
    backgroundColor: 'rgba(196, 201, 212, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(196, 201, 212, 0.2)',
  },
  danger: {
    backgroundColor: 'rgba(227, 27, 35, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(227, 27, 35, 0.35)',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryLabel: {
    color: '#C4C9D4',
  },
  pressed: {
    backgroundColor: '#FF4D55',
    opacity: 0.92,
    transform: [{scale: 0.98}],
  },
  disabled: {
    opacity: 0.48,
  },
})
