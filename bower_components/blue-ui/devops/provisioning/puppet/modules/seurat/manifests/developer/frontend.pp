# This installs whatever a frontend developer on Seurat requires.
class seurat::developer::frontend {
  $packages = [
    'nodejs',
  ]
  package { $packages:
    ensure => present,
  }
}
