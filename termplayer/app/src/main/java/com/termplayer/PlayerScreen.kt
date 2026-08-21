package com.termplayer

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

// ──────────────────────────────────────────────────────────────────
//  Main screen
// ──────────────────────────────────────────────────────────────────

@Composable
fun PlayerScreen() {
    val context = LocalContext.current
    val scope   = rememberCoroutineScope()
    val listState = rememberLazyListState()

    // ── Compose state ─────────────────────────────────────────────
    var tracks         by remember { mutableStateOf<List<Track>>(emptyList()) }
    var currentTrack   by remember { mutableStateOf<Track?>(null) }
    var currentState   by remember { mutableStateOf(PlaybackState.STOPPED) }
    var currentPosition by remember { mutableStateOf(0) }
    var currentDuration by remember { mutableStateOf(0) }
    var scanComplete   by remember { mutableStateOf(false) }
    var hasPermission  by remember { mutableStateOf(false) }
    var selectedIndex  by remember { mutableStateOf(-1) }

    // ── Playback engine (survives recompositions) ─────────────────
    val playbackManager = remember { PlaybackManager() }

    // ── Permission handling ───────────────────────────────────────
    val permission: String = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        Manifest.permission.READ_MEDIA_AUDIO
    } else {
        Manifest.permission.READ_EXTERNAL_STORAGE
    }

    var pendingScan by remember { mutableStateOf(false) }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasPermission = granted
        if (granted && pendingScan) {
            pendingScan = false
            launchScan(scope, playbackManager, context) { scanned ->
                tracks = scanned
                scanComplete = true
            }
        }
    }

    fun scanTracks() {
        if (hasPermission) {
            launchScan(scope, playbackManager, context) { scanned ->
                tracks = scanned
                scanComplete = true
            }
        } else {
            pendingScan = true
            permissionLauncher.launch(permission)
        }
    }

    // Check permission once on mount
    LaunchedEffect(Unit) {
        hasPermission = ContextCompat.checkSelfPermission(
            context, permission
        ) == PackageManager.PERMISSION_GRANTED
    }

    // ── Wire playback callbacks → Compose state ───────────────────
    LaunchedEffect(Unit) {
        playbackManager.onStateChanged = {
            currentState    = playbackManager.state
            currentTrack    = playbackManager.currentTrack
            currentDuration = playbackManager.duration
        }
        playbackManager.onTrackChanged = {
            currentTrack = playbackManager.currentTrack
            selectedIndex = playbackManager.currentIndex
        }
    }

    // ── Poll position while playing ───────────────────────────────
    LaunchedEffect(currentState) {
        while (currentState == PlaybackState.PLAYING) {
            playbackManager.updatePosition()
            currentPosition = playbackManager.currentPosition
            delay(500)
        }
    }

    // ── Release player when composable leaves the tree ────────────
    DisposableEffect(Unit) {
        onDispose { playbackManager.release() }
    }

    // ── Layout ────────────────────────────────────────────────────
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(TerminalBg)
            .systemBarsPadding()
            .padding(horizontal = 10.dp, vertical = 8.dp)
    ) {
        // Status bar
        StatusBar(currentTrack, currentState)

        Spacer(Modifier.height(4.dp))
        TerminalDivider()
        Spacer(Modifier.height(4.dp))

        // Track list (takes remaining space)
        Box(Modifier.weight(1f)) {
            when {
                !scanComplete -> WelcomeText()
                tracks.isEmpty() -> EmptyText()
                else -> TrackList(
                    tracks = tracks,
                    listState = listState,
                    playingIndex = if (currentState == PlaybackState.PLAYING)
                        selectedIndex else -1,
                    selectedIndex = selectedIndex,
                    onTrackClick = { index ->
                        selectedIndex = index
                        playbackManager.play(index)
                    }
                )
            }
        }

        // Progress bar (visible while playing or paused)
        if (currentState != PlaybackState.STOPPED && currentTrack != null) {
            Spacer(Modifier.height(4.dp))
            ProgressBar(currentPosition, currentDuration)
        }

        Spacer(Modifier.height(4.dp))
        TerminalDivider()
        Spacer(Modifier.height(4.dp))

        // Control bar
        ControlBar(
            isPlaying = currentState == PlaybackState.PLAYING,
            onPlayPause = { playbackManager.toggle() },
            onPrev = { playbackManager.prev() },
            onNext = { playbackManager.next() },
            onScan = ::scanTracks
        )
    }
}

// ──────────────────────────────────────────────────────────────────
//  Sub-composables
// ──────────────────────────────────────────────────────────────────

@Composable
private fun StatusBar(track: Track?, state: PlaybackState) {
    val stateLabel = when (state) {
        PlaybackState.PLAYING -> "PLAYING"
        PlaybackState.PAUSED  -> "PAUSED"
        PlaybackState.STOPPED -> "STOPPED"
    }

    Column {
        Text(
            text = "╔══════════════════════════════════════╗",
            color = TerminalGreen, fontFamily = TerminalFont, fontSize = 12.sp
        )
        Text(
            text = "║  TERMPLAYER v1.0                    ║",
            color = TerminalGreen, fontFamily = TerminalFont,
            fontSize = 12.sp, fontWeight = FontWeight.Bold
        )
        Text(
            text = "║  State: $stateLabel${" ".repeat(32 - stateLabel.length)}║",
            color = if (state == PlaybackState.PLAYING) TerminalGreen
                    else TerminalDimGreen,
            fontFamily = TerminalFont, fontSize = 12.sp
        )
        if (track != null) {
            val raw = "Now: ${track.displayTitle}"
            val line = if (raw.length > 36) raw.take(35) + "…" else raw
            Text(
                text = "║  $line${" ".repeat(37 - line.length)}║",
                color = TerminalGreen, fontFamily = TerminalFont, fontSize = 12.sp
            )
        }
        Text(
            text = "╚══════════════════════════════════════╝",
            color = TerminalGreen, fontFamily = TerminalFont, fontSize = 12.sp
        )
    }
}

@Composable
private fun TrackList(
    tracks: List<Track>,
    listState: androidx.compose.foundation.lazy.LazyListState,
    playingIndex: Int,
    selectedIndex: Int,
    onTrackClick: (Int) -> Unit
) {
    LazyColumn(state = listState) {
        itemsIndexed(tracks) { index, track ->
            TrackRow(
                track = track,
                index = index,
                isPlaying = index == playingIndex,
                isSelected = index == selectedIndex,
                onClick = { onTrackClick(index) }
            )
        }
    }
}

@Composable
private fun TrackRow(
    track: Track,
    index: Int,
    isPlaying: Boolean,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val prefix = if (isPlaying) "> " else "  "
    val num    = "%3d".format(index + 1)
    val color  = when {
        isPlaying  -> TerminalGreen
        isSelected -> TerminalDimGreen
        else       -> TerminalGreen.copy(alpha = 0.7f)
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(vertical = 2.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = "$prefix$num. ",
            color = color, fontFamily = TerminalFont, fontSize = 13.sp
        )
        Text(
            text = track.displayTitle,
            color = color, fontFamily = TerminalFont, fontSize = 13.sp,
            maxLines = 1, modifier = Modifier.weight(1f)
        )
        Text(
            text = " (${track.durationFormatted})",
            color = TerminalDimGreen, fontFamily = TerminalFont, fontSize = 12.sp
        )
    }
}

@Composable
private fun ProgressBar(currentMs: Int, totalMs: Int) {
    if (totalMs <= 0) return

    val barWidth = 30
    val progress = (currentMs.toFloat() / totalMs).coerceIn(0f, 1f)
    val filled   = (progress * barWidth).toInt()
    val empty    = (barWidth - filled - 1).coerceAtLeast(0)

    val bar = buildString {
        append("=".repeat(filled))
        append(">")
        append(" ".repeat(empty))
    }

    Text(
        text = "  [$bar] ${formatTime(currentMs)} / ${formatTime(totalMs)}",
        color = TerminalGreen, fontFamily = TerminalFont, fontSize = 13.sp
    )
}

@Composable
private fun ControlBar(
    isPlaying: Boolean,
    onPlayPause: () -> Unit,
    onPrev: () -> Unit,
    onNext: () -> Unit,
    onScan: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceEvenly
    ) {
        TerminalButton(if (isPlaying) "PAUSE" else "PLAY", onPlayPause)
        TerminalButton("PREV", onPrev)
        TerminalButton("NEXT", onNext)
        TerminalButton("SCAN", onScan)
    }
}

@Composable
private fun TerminalButton(label: String, onClick: () -> Unit) {
    Text(
        text = "[$label]",
        color = TerminalGreen,
        fontFamily = TerminalFont,
        fontSize = 14.sp,
        fontWeight = FontWeight.Bold,
        modifier = Modifier
            .clickable(onClick = onClick)
            .padding(horizontal = 8.dp, vertical = 10.dp)
    )
}

// ── Static text screens ──────────────────────────────────────────

@Composable
private fun WelcomeText() {
    Text(
        text = "> TermPlayer v1.0\n> Offline terminal music player.\n> Press [SCAN] to search for music.",
        color = TerminalDimGreen, fontFamily = TerminalFont,
        fontSize = 14.sp, modifier = Modifier.padding(8.dp),
        lineHeight = 20.sp
    )
}

@Composable
private fun EmptyText() {
    Text(
        text = "> No audio files found.\n> Press [SCAN] to rescan.",
        color = TerminalDimGreen, fontFamily = TerminalFont,
        fontSize = 14.sp, modifier = Modifier.padding(8.dp),
        lineHeight = 20.sp
    )
}

@Composable
private fun TerminalDivider() {
    Text(
        text = "═".repeat(42),
        color = TerminalDarkGreen, fontFamily = TerminalFont, fontSize = 12.sp
    )
}

// ── Helpers ──────────────────────────────────────────────────────

private fun launchScan(
    scope: kotlinx.coroutines.CoroutineScope,
    manager: PlaybackManager,
    context: android.content.Context,
    onResult: (List<Track>) -> Unit
) {
    scope.launch(Dispatchers.IO) {
        val scanned = MediaScanner.scan(context)
        manager.tracks = scanned
        onResult(scanned)
    }
}

private fun formatTime(ms: Int): String {
    val totalSec = ms / 1000
    return "%d:%02d".format(totalSec / 60, totalSec % 60)
}
