const styles = {
  mainStyle: {
    background: '#fff',
    color: 'black',
    width: '10rem',
    padding: '0.5rem 1rem',
    fontSize: '14px',
  },
  precentageElementStyle: {
    marginTop: '5px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  labelStyle: {
    color: '#123',
    marginRight: '10px',
  },
}

export default function Percentage({ labels, data }) {
  const totalPrecent = data.length ? data.reduce((a, b) => a + b) : 0

  const calcPercentage = (whole, fraction) => {
    const precent = fraction / whole
    const percentage = (precent * 100).toFixed(2)
    return percentage
  }

  return (
    <div>
      <main style={styles.mainStyle}>
        {labels.map((label, index) => {
          const percentage = calcPercentage(totalPrecent, data[index])
          return (
            <div style={styles.precentageElementStyle} key={index}>
              <label style={styles.labelStyle}>{label} </label>
              <span style={{ color: '#09f' }}>{percentage} %</span>
            </div>
          )
        })}
      </main>
    </div>
  )
}
