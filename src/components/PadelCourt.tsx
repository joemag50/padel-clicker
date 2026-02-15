import React from 'react';
import { View, StyleSheet } from 'react-native';

export function PadelCourt() {
  return (
    <View style={styles.court} pointerEvents="none">
      {/* Court surface (green) */}
      <View style={styles.surface} />

      {/* Glass walls - left & right */}
      <View style={[styles.glassWall, styles.glassWallLeft]} />
      <View style={[styles.glassWall, styles.glassWallRight]} />

      {/* Back wall (top) */}
      <View style={styles.backWall}>
        {/* Metal frame bars */}
        <View style={[styles.metalBar, { left: '25%' }]} />
        <View style={[styles.metalBar, { left: '50%' }]} />
        <View style={[styles.metalBar, { left: '75%' }]} />
        {/* Horizontal bar */}
        <View style={styles.metalBarH} />
      </View>

      {/* Court lines */}
      <View style={styles.centerLineV} />
      <View style={styles.serviceLineTop} />
      <View style={styles.serviceLineBottom} />
      <View style={styles.sideLineLeft} />
      <View style={styles.sideLineRight} />
      <View style={styles.baseLineTop} />
      <View style={styles.baseLineBottom} />

      {/* Net */}
      <View style={styles.net}>
        <View style={styles.netPost} />
        <View style={styles.netLine} />
        <View style={styles.netPostRight} />
        {/* Net grid lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={`nv-${i}`}
            style={[styles.netGridV, { left: `${12.5 * (i + 1)}%` }]}
          />
        ))}
      </View>

      {/* Corner shadows for depth */}
      <View style={[styles.cornerShadow, styles.cornerTL]} />
      <View style={[styles.cornerShadow, styles.cornerTR]} />
      <View style={[styles.cornerShadow, styles.cornerBL]} />
      <View style={[styles.cornerShadow, styles.cornerBR]} />
    </View>
  );
}

const COURT_GREEN = '#1b5e20';
const COURT_GREEN_LIGHT = '#2e7d32';
const LINE_COLOR = 'rgba(255, 255, 255, 0.45)';
const GLASS_COLOR = 'rgba(100, 180, 255, 0.08)';
const METAL_COLOR = 'rgba(150, 170, 190, 0.25)';
const NET_COLOR = 'rgba(255, 255, 255, 0.5)';

const styles = StyleSheet.create({
  court: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  surface: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COURT_GREEN,
    opacity: 0.25,
  },

  // Glass walls
  glassWall: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 6,
  },
  glassWallLeft: {
    left: 0,
    backgroundColor: GLASS_COLOR,
    borderRightWidth: 1,
    borderRightColor: 'rgba(100, 180, 255, 0.15)',
  },
  glassWallRight: {
    right: 0,
    backgroundColor: GLASS_COLOR,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(100, 180, 255, 0.15)',
  },

  // Back wall
  backWall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: 'rgba(60, 80, 100, 0.15)',
    borderBottomWidth: 2,
    borderBottomColor: METAL_COLOR,
  },
  metalBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: METAL_COLOR,
  },
  metalBarH: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: METAL_COLOR,
  },

  // Court lines
  centerLineV: {
    position: 'absolute',
    left: '50%',
    top: '15%',
    bottom: '15%',
    width: 2,
    backgroundColor: LINE_COLOR,
    marginLeft: -1,
  },
  serviceLineTop: {
    position: 'absolute',
    top: '35%',
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: LINE_COLOR,
  },
  serviceLineBottom: {
    position: 'absolute',
    bottom: '35%',
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: LINE_COLOR,
  },
  sideLineLeft: {
    position: 'absolute',
    left: '10%',
    top: '15%',
    bottom: '15%',
    width: 2,
    backgroundColor: LINE_COLOR,
  },
  sideLineRight: {
    position: 'absolute',
    right: '10%',
    top: '15%',
    bottom: '15%',
    width: 2,
    backgroundColor: LINE_COLOR,
  },
  baseLineTop: {
    position: 'absolute',
    top: '15%',
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: LINE_COLOR,
  },
  baseLineBottom: {
    position: 'absolute',
    bottom: '15%',
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: LINE_COLOR,
  },

  // Net
  net: {
    position: 'absolute',
    top: '49%',
    left: '5%',
    right: '5%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderTopWidth: 2,
    borderTopColor: NET_COLOR,
  },
  netPost: {
    position: 'absolute',
    left: -4,
    top: -8,
    width: 6,
    height: 22,
    backgroundColor: METAL_COLOR,
    borderRadius: 2,
  },
  netPostRight: {
    position: 'absolute',
    right: -4,
    top: -8,
    width: 6,
    height: 22,
    backgroundColor: METAL_COLOR,
    borderRadius: 2,
  },
  netLine: {
    position: 'absolute',
    top: 3,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  netGridV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // Corner depth shadows
  cornerShadow: {
    position: 'absolute',
    width: 30,
    height: 30,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 30,
    borderBottomWidth: 30,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  cornerTR: {
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
});
