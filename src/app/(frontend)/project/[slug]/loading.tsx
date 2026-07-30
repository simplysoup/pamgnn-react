export default function ProjectLoading() {
  return (
    <div
      style={{
        paddingTop: 180,
        maxWidth: 800,
        margin: '0 auto',
        paddingLeft: 24,
        paddingRight: 24,
      }}
    >
      {/* Title skeleton */}
      <div
        style={{
          height: 48,
          width: '60%',
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: 8,
          marginBottom: 16,
        }}
      />
      {/* Summary skeleton */}
      <div
        style={{
          height: 20,
          width: '40%',
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: 8,
          marginBottom: 48,
        }}
      />
      {/* Content block skeletons */}
      <div
        style={{
          height: 200,
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderRadius: 12,
          marginBottom: 24,
        }}
      />
      <div
        style={{
          height: 16,
          width: '90%',
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderRadius: 4,
          marginBottom: 12,
        }}
      />
      <div
        style={{
          height: 16,
          width: '70%',
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderRadius: 4,
          marginBottom: 12,
        }}
      />
      <div
        style={{
          height: 16,
          width: '80%',
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderRadius: 4,
        }}
      />
    </div>
  )
}
