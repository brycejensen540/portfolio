package com.termplayer

import android.media.MediaPlayer

/**
 * Thin wrapper around [MediaPlayer] that manages a playlist of [Track]s,
 * provides simple transport controls, and exposes lightweight callbacks
 * so the Compose UI can react to state changes.
 */
class PlaybackManager {

    // ── Playlist ──────────────────────────────────────────────────
    var tracks: List<Track> = emptyList()
    var currentIndex: Int = -1
        private set

    val currentTrack: Track?
        get() = tracks.getOrNull(currentIndex)

    // ── Playback state ────────────────────────────────────────────
    var state: PlaybackState = PlaybackState.STOPPED
        private set

    var currentPosition: Int = 0
        private set

    var duration: Int = 0
        private set

    // ── Callbacks (set by the UI) ─────────────────────────────────
    var onStateChanged: (() -> Unit)? = null
    var onTrackChanged: (() -> Unit)? = null

    // ── Internal player ───────────────────────────────────────────
    private var player: MediaPlayer? = null

    // ── Transport controls ────────────────────────────────────────

    /** Start (or restart) playback at the given [index]. */
    fun play(index: Int) {
        if (index !in tracks.indices) return

        releasePlayer()
        currentIndex = index
        val track = tracks[index]

        try {
            player = MediaPlayer().apply {
                setDataSource(track.path)
                prepare()
                start()
            }

            duration = player?.duration ?: 0
            currentPosition = 0
            state = PlaybackState.PLAYING

            player?.setOnCompletionListener { next() }

            onTrackChanged?.invoke()
            onStateChanged?.invoke()
        } catch (_: Exception) {
            state = PlaybackState.STOPPED
            onStateChanged?.invoke()
        }
    }

    /** Toggle between play and pause. Starts from current index if stopped. */
    fun toggle() {
        when (state) {
            PlaybackState.PLAYING -> {
                player?.pause()
                state = PlaybackState.PAUSED
                onStateChanged?.invoke()
            }
            PlaybackState.PAUSED -> {
                player?.start()
                state = PlaybackState.PLAYING
                onStateChanged?.invoke()
            }
            PlaybackState.STOPPED -> {
                val start = currentIndex.coerceAtLeast(0)
                if (tracks.isNotEmpty()) play(start)
            }
        }
    }

    /** Advance to the next track (wraps around). */
    fun next() {
        if (tracks.isEmpty()) return
        val next = if (currentIndex < tracks.size - 1) currentIndex + 1 else 0
        play(next)
    }

    /** Go to the previous track (wraps around). */
    fun prev() {
        if (tracks.isEmpty()) return
        val prev = if (currentIndex > 0) currentIndex - 1 else tracks.size - 1
        play(prev)
    }

    /** Stop playback and reset position. */
    fun stop() {
        releasePlayer()
        state = PlaybackState.STOPPED
        currentPosition = 0
        duration = 0
        onStateChanged?.invoke()
    }

    /** Poll current position from the underlying player. */
    fun updatePosition() {
        player?.let { if (it.isPlaying) currentPosition = it.currentPosition }
    }

    /** Release the MediaPlayer (call from DisposableEffect). */
    fun release() {
        releasePlayer()
    }

    private fun releasePlayer() {
        player?.release()
        player = null
    }
}

enum class PlaybackState { STOPPED, PLAYING, PAUSED }
