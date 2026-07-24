// apps/XStore/src/components/common/ImageZoom.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  Animated,
  Text,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ImageZoomProps {
  source: { uri: string };
  style?: any;
  resizeMode?: 'cover' | 'contain' | 'stretch';
}

export const ImageZoom: React.FC<ImageZoomProps> = ({
  source,
  style,
  resizeMode = 'cover',
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const lastTapRef = useRef<{ x: number; y: number; time: number }>({
    x: 0,
    y: 0,
    time: 0,
  });

  // Pan responder for dragging
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (scale > 1) {
          setTranslateX(translateX + gestureState.dx);
          setTranslateY(translateY + gestureState.dy);
        }
      },
      onPanResponderRelease: () => {
        // Snap back if dragged too far
        if (Math.abs(translateX) > 100 || Math.abs(translateY) > 100) {
          closeModal();
        }
      },
    })
  ).current;

  const handleImagePress = (event: any) => {
    const { locationX, locationY, timestamp } = event.nativeEvent;
    const timeDiff = timestamp - lastTapRef.current.time;
    const distance = Math.sqrt(
      Math.pow(locationX - lastTapRef.current.x, 2) +
      Math.pow(locationY - lastTapRef.current.y, 2)
    );

    if (timeDiff < 300 && distance < 20) {
      // Double tap detected
      handleDoubleTap(locationX, locationY);
    }

    lastTapRef.current = {
      x: locationX,
      y: locationY,
      time: timestamp,
    };
  };

  const handleDoubleTap = (x: number, y: number) => {
    if (scale > 1) {
      // Reset zoom
      setScale(1);
      setTranslateX(0);
      setTranslateY(0);
    } else {
      // Zoom in at tap location
      const targetScale = 3;
      const newX = -(x * targetScale - screenWidth / 2);
      const newY = -(y * targetScale - screenHeight / 2);
      setScale(targetScale);
      setTranslateX(Math.max(-screenWidth * (targetScale - 1) / 2, Math.min(screenWidth * (targetScale - 1) / 2, newX)));
      setTranslateY(Math.max(-screenHeight * (targetScale - 1) / 2, Math.min(screenHeight * (targetScale - 1) / 2, newY)));
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  };

  const handleZoomIn = () => {
    setScale(Math.min(scale + 0.5, 4));
  };

  const handleZoomOut = () => {
    setScale(Math.max(scale - 0.5, 1));
  };

  return (
    <>
      {/* Thumbnail */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
        style={style}
      >
        <Image
          source={source}
          style={style}
          resizeMode={resizeMode}
        />
      </TouchableOpacity>

      {/* Full Screen Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer} {...panResponder.panHandlers}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Zoom Controls */}
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
              <Text style={styles.zoomButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.zoomLevel}>{Math.round(scale * 100)}%</Text>
            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
              <Text style={styles.zoomButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Zoomed Image */}
          <Animated.View
            style={[
              styles.imageWrapper,
              {
                transform: [
                  { scale },
                  { translateX },
                  { translateY },
                ],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleImagePress}
              style={styles.imageTouchable}
            >
              <Image
                source={source}
                style={styles.fullImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionsText}>
              Pinch to zoom • Double tap to zoom in/out
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  imageWrapper: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageTouchable: {
    width: screenWidth,
    height: screenHeight,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  zoomControls: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  zoomLevel: {
    color: '#fff',
    fontSize: 14,
    marginHorizontal: 12,
    minWidth: 50,
    textAlign: 'center',
  },
  instructions: {
    position: 'absolute',
    bottom: 40,
  },
  instructionsText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
});